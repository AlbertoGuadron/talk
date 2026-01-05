"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00D4FF] via-[#0099FF] to-[#9D4EDD] py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-12 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 inline-block">
              <Image
                src="/galeria/logotalk.png"
                alt="TALK Digital Insights"
                width={500}
                height={150}
                className="mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            Digital Insights
            <span className="block mt-2 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
              en Tiempo Real
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            La plataforma de <span className="font-semibold">real-time market research</span> que analiza tendencias,
            conversación y comportamiento digital para guiar a tu marca con
            datos actualizados.
          </p>
          
          {/* Stats or icons */}
          <div className="flex justify-center gap-8 flex-wrap mt-16">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-bold text-white">4</div>
              <div className="text-sm text-white/90">Mercados</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/90">Monitoreo</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-bold text-white">Real-Time</div>
              <div className="text-sm text-white/90">Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                ¿Qué es la{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                  Serie TALK
                </span>
                ?
              </h2>
              <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mb-16 font-light">
            La serie TALK es una <span className="font-semibold text-gray-900">investigación de mercado en tiempo real</span> que
            integra múltiples fuentes digitales para ayudarte a tomar
            decisiones estratégicas más inteligentes para tu marca.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-cyan-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Datos en Tiempo Real
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  La solución de market research que te muestra qué está
                  pasando en el mercado ahora mismo y cómo usarlo
                  estratégicamente.
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Claridad Estratégica
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Te da claridad en un entorno digital saturado: qué funciona,
                  por qué funciona y cómo replicarlo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Nuestra Market Research{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                  Permanente
                </span>
              </h2>
              <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6 font-light">
              Sobre 4 mercados claves de la economía
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* HouseTalk */}
            <Link href="/housetalk" className="group">
              <div className="relative h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>
                
                <div className="relative p-10 text-white">
                  <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                    <Image
                      src="/galeria/housetalk.png"
                      alt="HouseTalk"
                      width={280}
                      height={70}
                      className="brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-3xl font-black mb-4">
                    Bienes y Raíces
                  </h3>
                  <p className="text-white/95 mb-4 leading-relaxed text-lg">
                    Analiza el comportamiento digital del mercado de Bienes y
                    raíces: qué buscan los compradores, qué proyectos destacan
                    y qué tendencias están definiendo la demanda.
                  </p>
                  <p className="text-white font-semibold text-lg flex items-center">
                    Identificar oportunidades reales
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </div>
              </div>
            </Link>

            {/* RetailTalk */}
            <Link href="/retailtalk" className="group">
              <div className="relative h-full bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>
                
                <div className="relative p-10 text-white">
                  <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                    <Image
                      src="/galeria/retailtalk.png"
                      alt="RetailTalk"
                      width={280}
                      height={70}
                      className="brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Retail</h3>
                  <p className="text-white/95 mb-4 leading-relaxed text-lg">
                    Analiza el desempeño digital de los comercios Retail:
                    categorías, productos y promociones que generan mayor
                    impacto.
                  </p>
                  <p className="text-white font-semibold text-lg flex items-center">
                    Optimizar estrategia comercial
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </div>
              </div>
            </Link>

            {/* FoodTalk */}
            <Link href="/foodtalk" className="group">
              <div className="relative h-full bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>
                
                <div className="relative p-10 text-white">
                  <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                    <Image
                      src="/galeria/foodtalk.png"
                      alt="FoodTalk"
                      width={280}
                      height={70}
                      className="brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Restaurantes</h3>
                  <p className="text-white/95 mb-4 leading-relaxed text-lg">
                    Monitoreamos lo que mueve al consumidor en el sector de
                    restaurantes: promociones, contenido, líderes del mercado y
                    tendencias de consumo.
                  </p>
                  <p className="text-white font-semibold text-lg flex items-center">
                    Insights del sector alimenticio
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </div>
              </div>
            </Link>

            {/* MarketTalk */}
            <Link href="/markettalk" className="group">
              <div className="relative h-full bg-gradient-to-br from-green-600 to-teal-700 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>
                
                <div className="relative p-10 text-white">
                  <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                    <Image
                      src="/galeria/markettalk.png"
                      alt="MarketTalk"
                      width={280}
                      height={70}
                      className="brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Supermercado</h3>
                  <p className="text-white/95 mb-4 leading-relaxed text-lg">
                    Estudia los grandes movimientos del mercado digital: hábitos
                    de los usuarios, picos de conversación y cambios en el
                    comportamiento del consumidor.
                  </p>
                  <p className="text-white font-semibold text-lg flex items-center">
                    Decisiones más informadas
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            ¿Listo para llevar tu marca al{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              siguiente nivel
            </span>{" "}
            este 2026?
          </h2>
          <p className="text-xl text-white/90 mb-12 font-light">
            Lleva tu marca al siguiente nivel, escríbenos a
          </p>
          <a
            href="mailto:info@digitalinsightsla.com"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-10 py-5 rounded-full text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@digitalinsightsla.com
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}