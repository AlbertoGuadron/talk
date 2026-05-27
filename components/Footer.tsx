import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#040810",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
      className="py-10 px-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Image
          src="/galeria/logotalk.png"
          alt="TALK Digital Insights"
          width={120}
          height={48}
          className="h-12 w-auto opacity-70"
        />
        <p className="text-slate-600 text-sm text-center">
          © 2026 TALK Digital Insights · Todos los derechos reservados
        </p>
        <div className="flex gap-4 text-slate-600 text-sm">
          {/* <Link href="/admin" className="hover:text-slate-400 transition-colors">
            Admin
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
