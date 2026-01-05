"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-700' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-sky-500' },
    { name: 'Youtube', icon: Youtube, href: 'https://youtube.com', color: 'hover:text-red-600' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* CTA Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  ¿Listo para llevar tu marca
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  al siguiente nivel?
                </span>
              </h2>
              <p className="text-gray-400 text-lg">
                Transforma tus datos en insights accionables
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contacto"
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-lg font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
              >
                <span className="relative z-10">Comenzar Ahora</span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg font-semibold text-lg hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Ver Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative w-32 h-12 transition-transform hover:scale-105">
                <Image
                  src="/galeria/logotalk.png"
                  alt="Talk Digital Insights"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Transformando datos en decisiones inteligentes para impulsar el crecimiento de tu negocio.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-cyan-400" />
                <a href="mailto:info@talkdigital.com" className="text-xs">
                  info@talkdigital.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-blue-400" />
                <a href="tel:+50312345678" className="text-xs">
                  +503 1234-5678
                </a>
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs">
                  San Salvador, El Salvador
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-base font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Síguenos
            </h3>
            <p className="text-gray-400 text-xs mb-4">
              Mantente actualizado con las últimas tendencias y insights del mercado.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold mb-2 text-white">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                />
                <button className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                  <Mail className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
            <p>
              © {new Date().getFullYear()} <span className="text-white font-semibold">Talk Digital Insights</span>. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacidad" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-white transition-colors">
                Términos de Uso
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}