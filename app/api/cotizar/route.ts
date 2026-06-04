import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const DEST = "aguadron@digitalinsightsla.com";

export async function POST(req: NextRequest) {
  try {
    const { nombre, empresa, cargo, telefono, pais, mensaje } = await req.json();

    if (!nombre || !empresa || !cargo || !telefono || !pais || !mensaje) {
      return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
    }

    await resend.emails.send({
      from: "TALK Digital Insights <onboarding@resend.dev>",
      to: DEST,
      replyTo: undefined,
      subject: `Nueva cotización de ${nombre} — ${empresa}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#FF1493,#00B4D8);padding:28px 32px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
              Nueva Solicitud de Cotización
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
              TALK Digital Insights
            </p>
          </div>
          <div style="padding:28px 32px;background:#fff;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;width:35%;">
                  <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Nombre</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:15px;color:#0f172a;font-weight:600;">${nombre}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Empresa</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:15px;color:#0f172a;font-weight:600;">${empresa}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Cargo</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:15px;color:#0f172a;">${cargo}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Teléfono</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:15px;color:#0f172a;">${telefono}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">País</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                  <span style="font-size:15px;color:#0f172a;">${pais}</span>
                </td>
              </tr>
            </table>
            <div style="margin-top:20px;">
              <p style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Mensaje</p>
              <div style="background:#f8fafc;border-radius:8px;padding:16px;border-left:3px solid #FF1493;">
                <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;">${mensaje.replace(/\n/g, "<br>")}</p>
              </div>
            </div>
          </div>
          <div style="padding:16px 32px;background:#f8fafc;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              Enviado desde el formulario de cotización de TALK Digital Insights
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Error al enviar el mensaje." }, { status: 500 });
  }
}
