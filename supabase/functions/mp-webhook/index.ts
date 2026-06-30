// Edge Function: mp-webhook
// Recebe notificações do Mercado Pago, confirma o pagamento e baixa o estoque.
// Idempotente: só processa um pedido pending uma vez.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpToken) return new Response("missing token", { status: 500 });

    const url = new URL(req.url);

    // MP pode notificar via query (?type=payment&data.id=...) ou via corpo JSON.
    let paymentId =
      url.searchParams.get("data.id") || url.searchParams.get("id") || null;
    let topic =
      url.searchParams.get("type") || url.searchParams.get("topic") || null;

    if (!paymentId) {
      try {
        const body = await req.json();
        topic = topic || body?.type || body?.topic;
        paymentId = body?.data?.id || body?.id || null;
      } catch {
        /* sem corpo */
      }
    }

    // Só nos interessa notificação de pagamento.
    if (topic && topic !== "payment") {
      return new Response("ignored", { status: 200 });
    }
    if (!paymentId) {
      return new Response("no payment id", { status: 200 });
    }

    // Consulta o pagamento na API do MP (fonte de verdade).
    const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` }
    });
    if (!payRes.ok) {
      console.error("Falha ao consultar pagamento MP", await payRes.text());
      return new Response("payment fetch failed", { status: 200 });
    }
    const payment = await payRes.json();
    const orderId = payment.external_reference || payment.metadata?.order_id;
    if (!orderId) return new Response("no order ref", { status: 200 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) return new Response("order not found", { status: 200 });

    const newStatus =
      payment.status === "approved"
        ? "paid"
        : payment.status === "rejected" || payment.status === "cancelled"
        ? "failed"
        : "pending";

    // Idempotência: se já está pago, não reprocessa estoque.
    if (order.status === "paid") {
      return new Response("already processed", { status: 200 });
    }

    if (newStatus === "paid") {
      // Marca pago primeiro (guarda contra concorrência).
      const { data: updated } = await supabase
        .from("orders")
        .update({ status: "paid", mp_payment_id: String(paymentId) })
        .eq("id", orderId)
        .eq("status", "pending")
        .select()
        .maybeSingle();

      // Só baixa estoque se esta chamada foi a que efetivou a transição.
      if (updated) {
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", orderId);

        for (const oi of orderItems || []) {
          if (oi.product_id) {
            await supabase.rpc("decrement_product_stock", {
              p_id: oi.product_id,
              p_qty: oi.quantity
            });
          }
        }
      }
    } else if (newStatus === "failed") {
      await supabase
        .from("orders")
        .update({ status: "failed", mp_payment_id: String(paymentId) })
        .eq("id", orderId)
        .eq("status", "pending");
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error(err);
    // Responde 200 para evitar reentregas infinitas; o erro fica logado.
    return new Response("error logged", { status: 200 });
  }
});
