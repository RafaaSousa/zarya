// Edge Function: create-preference
// Revalida itens/preços/estoque no servidor, calcula frete, cria o pedido (pending)
// e gera uma preferência de pagamento no Mercado Pago (Checkout Pro).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function normalizeCep(cep: string): string {
  return String(cep || "").replace(/\D/g, "").padStart(8, "0").slice(0, 8);
}

function pickRule(rules: any[], cepNum: number) {
  return (
    (rules || [])
      .filter((r) => r.is_active)
      .filter((r) => {
        const start = r.cep_start ? Number(r.cep_start) : 0;
        const end = r.cep_end ? Number(r.cep_end) : 99999999;
        return cepNum >= start && cepNum <= end;
      })
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0] || null
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { items, customer, cep, address } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Carrinho vazio" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpToken) {
      return new Response(
        JSON.stringify({ error: "MP_ACCESS_TOKEN não configurado no servidor." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Revalida produtos a partir do banco
    const ids = items.map((i: any) => i.id);
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name, price, stock, is_active")
      .in("id", ids);
    if (prodErr) throw prodErr;

    const prodMap = new Map((products || []).map((p) => [p.id, p]));

    const mpItems: any[] = [];
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const p = prodMap.get(item.id);
      if (!p || !p.is_active) {
        return new Response(
          JSON.stringify({ error: `Produto indisponível: ${item.name || item.id}` }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const qty = Math.max(1, Number(item.quantity) || 1);
      if (p.stock < qty) {
        return new Response(
          JSON.stringify({ error: `Estoque insuficiente para ${p.name}.` }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const unitPrice = Number(p.price);
      subtotal += unitPrice * qty;
      mpItems.push({
        title: p.name + (item.color ? ` (${item.color})` : ""),
        quantity: qty,
        unit_price: unitPrice,
        currency_id: "BRL"
      });
      orderItems.push({
        product_id: p.id,
        product_name: p.name,
        unit_price: unitPrice,
        quantity: qty,
        color: item.color ?? null
      });
    }

    // 2. Calcula frete pela regra
    const cepDigits = normalizeCep(cep);
    const { data: rules } = await supabase.from("shipping_rules").select("*").eq("is_active", true);
    const rule = pickRule(rules || [], Number(cepDigits));
    if (!rule) {
      return new Response(
        JSON.stringify({ error: "Não entregamos para este CEP no momento." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const isFreeShipping = rule.free_above != null && subtotal >= Number(rule.free_above);
    const shippingCost = isFreeShipping ? 0 : Number(rule.price);
    const total = subtotal + shippingCost;

    // 3. Cria o pedido (pending)
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        status: "pending",
        customer_name: customer?.name ?? null,
        customer_email: customer?.email ?? null,
        customer_cep: cepDigits,
        shipping_address: address ?? null,
        subtotal,
        shipping_cost: shippingCost,
        total
      })
      .select()
      .single();
    if (orderErr) throw orderErr;

    await supabase
      .from("order_items")
      .insert(orderItems.map((oi) => ({ ...oi, order_id: order.id })));

    if (shippingCost > 0) {
      mpItems.push({
        title: `Frete (${rule.label})`,
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "BRL"
      });
    }

    // 4. Cria a preferência no Mercado Pago
    const siteUrl =
      Deno.env.get("SITE_URL") || req.headers.get("origin") || "https://zaryaotica.com.br";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    const preferenceBody = {
      items: mpItems,
      payer: {
        name: customer?.name ?? undefined,
        email: customer?.email ?? undefined
      },
      back_urls: {
        success: `${siteUrl}/#/pedido/sucesso`,
        pending: `${siteUrl}/#/pedido/pendente`,
        failure: `${siteUrl}/#/pedido/falha`
      },
      auto_return: "approved",
      notification_url: `${supabaseUrl}/functions/v1/mp-webhook`,
      external_reference: order.id,
      metadata: { order_id: order.id }
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mpToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preferenceBody)
    });

    const pref = await mpRes.json();
    if (!mpRes.ok) {
      console.error("Erro MP:", pref);
      return new Response(
        JSON.stringify({ error: "Falha ao criar pagamento no Mercado Pago.", detail: pref }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase.from("orders").update({ mp_preference_id: pref.id }).eq("id", order.id);

    return new Response(
      JSON.stringify({
        order_id: order.id,
        preference_id: pref.id,
        init_point: pref.init_point,
        sandbox_init_point: pref.sandbox_init_point
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
