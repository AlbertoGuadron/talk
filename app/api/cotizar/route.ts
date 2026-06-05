import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const DEST = [
  "aguadron@digitalinsightsla.com",
  "albertoguadron@gmail.com", // ← cambia este por el correo que quieras agregar
];

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(req: NextRequest) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ error: "Email no configurado en el servidor." }, { status: 500 });
  }

  try {
    const { nombre, empresa, cargo, correo, telefono, pais, servicio, mensaje } = await req.json();

    if (!nombre || !empresa || !cargo || !correo || !telefono || !pais || !servicio || !mensaje) {
      return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"TALK Digital Insights" <${process.env.SMTP_USER}>`,
      to: DEST,
      subject: `Nueva cotización de ${nombre} — ${empresa} (${servicio})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#FF1493,#00B4D8);padding:28px 32px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">
              Nueva Solicitud de Cotización
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">TALK Digital Insights</p>
          </div>
          <div style="padding:28px 32px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;">
              ${[
                ["Nombre", nombre],
                ["Empresa", empresa],
                ["Cargo", cargo],
                ["Correo", correo],
                ["Teléfono", telefono],
                ["País", pais],
                ["Servicio", servicio],
              ].map(([label, value]) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;width:35%;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">${label}</td>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:15px;color:#0f172a;font-weight:600;">${value}</td>
                </tr>
              `).join("")}
            </table>
            <div style="margin-top:20px;">
              <p style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Mensaje</p>
              <div style="background:#f8fafc;border-radius:8px;padding:16px;border-left:3px solid #FF1493;">
                <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;">${mensaje.replace(/\n/g, "<br>")}</p>
              </div>
            </div>
          </div>
          <div style="padding:16px 32px;background:#f8fafc;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Formulario de cotización — TALK Digital Insights</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Error al enviar el mensaje. Intenta de nuevo." }, { status: 500 });
  }
}
