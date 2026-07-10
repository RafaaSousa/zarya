// Função serverless (Vercel) que recebe o formulário de contato e envia
// o e-mail via API do ZeptoMail. O token fica na env var ZEPTOMAIL_TOKEN
// (nunca no código / no frontend).

const TO_ADDRESS = "atendimento@zaryaotica.com.br";
const FROM_ADDRESS = "no-reply@zaryaotica.com.br";

const SUBJECT_LABELS = {
  catalogo: "Solicitar Catálogo",
  parceria: "Parceria B2B",
  suporte: "Suporte a Lojistas",
  outros: "Outros",
};

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const token = process.env.ZEPTOMAIL_TOKEN;
  if (!token) {
    console.error("ZEPTOMAIL_TOKEN não configurado.");
    return res.status(500).json({ error: "Serviço de e-mail não configurado." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Corpo da requisição inválido." });
    }
  }
  body = body || {};

  // Honeypot anti-spam: se preenchido, finge sucesso e ignora.
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const companyName = String(body.companyName || "").trim();
  const contactName = String(body.contactName || "").trim();
  const cnpj = String(body.cnpj || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!companyName || !contactName || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "E-mail inválido." });
  }

  const subjectLabel = SUBJECT_LABELS[subject] || subject;

  const htmlbody = `
    <div style="font-family: Arial, sans-serif; color: #1f1b13; line-height: 1.6;">
      <h2 style="color: #735c00; margin-bottom: 4px;">Novo contato pelo site</h2>
      <p style="margin-top: 0; color: #4d4635;">Assunto: <strong>${escapeHtml(subjectLabel)}</strong></p>
      <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
        <tr><td style="padding: 6px 12px; font-weight: bold;">Empresa</td><td style="padding: 6px 12px;">${escapeHtml(companyName)}</td></tr>
        <tr><td style="padding: 6px 12px; font-weight: bold;">Contato</td><td style="padding: 6px 12px;">${escapeHtml(contactName)}</td></tr>
        <tr><td style="padding: 6px 12px; font-weight: bold;">CNPJ</td><td style="padding: 6px 12px;">${escapeHtml(cnpj) || "-"}</td></tr>
        <tr><td style="padding: 6px 12px; font-weight: bold;">E-mail</td><td style="padding: 6px 12px;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 6px 12px; font-weight: bold;">Telefone</td><td style="padding: 6px 12px;">${escapeHtml(phone)}</td></tr>
      </table>
      <p style="margin-top: 16px; font-weight: bold;">Mensagem:</p>
      <p style="white-space: pre-wrap; background: #f5eddf; padding: 12px; border-radius: 8px;">${escapeHtml(message)}</p>
    </div>
  `;

  const payload = {
    from: { address: FROM_ADDRESS, name: "Site Zaryá" },
    to: [{ email_address: { address: TO_ADDRESS, name: "Zaryá Ótica" } }],
    reply_to: [{ address: email, name: contactName }],
    subject: `[Site] ${subjectLabel} — ${companyName}`,
    htmlbody,
  };

  try {
    const zeptoRes = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!zeptoRes.ok) {
      const detail = await zeptoRes.text();
      console.error("Falha ZeptoMail:", zeptoRes.status, detail);
      return res.status(502).json({ error: "Não foi possível enviar a mensagem. Tente novamente." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao chamar ZeptoMail:", err);
    return res.status(500).json({ error: "Erro interno ao enviar a mensagem." });
  }
}
