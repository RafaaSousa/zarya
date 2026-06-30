// Edge Function: calculate-shipping
// Calcula o frete com base nas regras manuais cadastradas pelo admin (tabela shipping_rules).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function normalizeCep(cep: string): string {
  return String(cep || "").replace(/\D/g, "").padStart(8, "0").slice(0, 8);
}

export function pickRule(rules: any[], cepNum: number) {
  const matching = rules
    .filter((r) => r.is_active)
    .filter((r) => {
      const start = r.cep_start ? Number(r.cep_start) : 0;
      const end = r.cep_end ? Number(r.cep_end) : 99999999;
      return cepNum >= start && cepNum <= end;
    })
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return matching[0] || null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cep, subtotal } = await req.json();
    const cepDigits = normalizeCep(cep);

    if (cepDigits.length !== 8 || cepDigits === "00000000") {
      return new Response(JSON.stringify({ error: "CEP inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: rules, error } = await supabase
      .from("shipping_rules")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    const rule = pickRule(rules || [], Number(cepDigits));

    if (!rule) {
      return new Response(
        JSON.stringify({ error: "Não entregamos para este CEP no momento." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sub = Number(subtotal) || 0;
    const isFree = rule.free_above != null && sub >= Number(rule.free_above);
    const price = isFree ? 0 : Number(rule.price);

    return new Response(
      JSON.stringify({
        price,
        free: isFree,
        delivery_days: rule.delivery_days,
        label: rule.label
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
