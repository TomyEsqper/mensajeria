import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function leerCuerpo(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  return {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const to = process.env.TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!to || !apiKey) {
    return res.status(500).json({
      error: "Falta configurar TO_EMAIL o RESEND_API_KEY.",
    });
  }

  try {
    const cuerpo = leerCuerpo(req);
    const nombre = String(cuerpo.nombre || "").trim();
    const correo = String(cuerpo.correo || "").trim();
    const mensaje = String(cuerpo.mensaje || "").trim();

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({ error: "Completa los tres campos." });
    }

    if (!EMAIL_RE.test(correo)) {
      return res.status(400).json({ error: "El correo no es válido." });
    }

    const resend = new Resend(apiKey);
    const from = process.env.FROM_EMAIL || "Formulario <beth.t@example.com>";
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: correo,
      subject: `Mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\n\n${mensaje}`,
    });

    if (error) {
      return res.status(502).json({ error: error.message || "No se pudo enviar el correo." });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "No se pudo enviar el correo." });
  }
}
