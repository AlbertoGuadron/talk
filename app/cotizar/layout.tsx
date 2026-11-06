import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Agenda una reunión – Solicita tu análisis de marca",
  description:
    "Solicita un análisis de posicionamiento digital de tu marca en El Salvador, Guatemala o Honduras. Rankings de redes sociales para tu industria.",
  alternates: { canonical: `${SITE_URL}/cotizar` },
  openGraph: {
    title: "Agenda una reunión | TALK Digital Insights",
    description:
      "Solicita un análisis de posicionamiento digital de tu marca en Centroamérica.",
    url: `${SITE_URL}/cotizar`,
  },
};

export default function CotizarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
