"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";

interface RankingData {
  rank: number;
  brand: string;
  percentage: string;
  reactions: number;
}

interface PlatformData {
  platform: string;
  icon: string;
  percentage: number;
  color: string;
}

export default function FoodTalkPage() {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'chart' | 'platforms'>('chart');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Cargar datos desde Google Sheets
  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/foodtalk/rankings');
      const data = await response.json();
      
      if (data.success && data.rankings) {
        setRankings(data.rankings);
        setLastUpdate(new Date(data.lastUpdate).toLocaleString('es-ES'));
      } else {
        // Datos de respaldo
        setRankings([
          { rank: 1, brand: "Wendys El Salvador", percentage: "24.76%", reactions: 15000 },
          { rank: 2, brand: "Freakie Dogs", percentage: "22.69%", reactions: 13750 },
          { rank: 3, brand: "Domino's El Salvador", percentage: "9.81%", reactions: 5950 },
          { rank: 4, brand: "Mister Donut", percentage: "8.04%", reactions: 4875 },
          { rank: 5, brand: "Recién Horneado Bakery", percentage: "6.09%", reactions: 3690 },
          { rank: 6, brand: "La Clásica", percentage: "4.23%", reactions: 2565 },
          { rank: 7, brand: "Buffalo Wings", percentage: "3.19%", reactions: 1935 },
          { rank: 8, brand: "Burger King El Salvador", percentage: "2.84%", reactions: 1720 },
          { rank: 9, brand: "Tacos Hermanos", percentage: "1.68%", reactions: 1020 },
          { rank: 10, brand: "Santa Burguesa", percentage: "1.42%", reactions: 860 },
        ]);
        setLastUpdate(new Date().toLocaleString('es-ES'));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Usar datos de respaldo en caso de error
      setRankings([
        { rank: 1, brand: "Wendys El Salvador", percentage: "24.76%", reactions: 15000 },
        { rank: 2, brand: "Freakie Dogs", percentage: "22.69%", reactions: 13750 },
        { rank: 3, brand: "Domino's El Salvador", percentage: "9.81%", reactions: 5950 },
        { rank: 4, brand: "Mister Donut", percentage: "8.04%", reactions: 4875 },
        { rank: 5, brand: "Recién Horneado Bakery", percentage: "6.09%", reactions: 3690 },
        { rank: 6, brand: "La Clásica", percentage: "4.23%", reactions: 2565 },
        { rank: 7, brand: "Buffalo Wings", percentage: "3.19%", reactions: 1935 },
        { rank: 8, brand: "Burger King El Salvador", percentage: "2.84%", reactions: 1720 },
        { rank: 9, brand: "Tacos Hermanos", percentage: "1.68%", reactions: 1020 },
        { rank: 10, brand: "Santa Burguesa", percentage: "1.42%", reactions: 860 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const platformData: PlatformData[] = [
    { platform: "Instagram", icon: "📸", percentage: 45, color: "bg-pink-500" },
    { platform: "Facebook", icon: "👍", percentage: 30, color: "bg-blue-600" },
    { platform: "TikTok", icon: "🎵", percentage: 15, color: "bg-purple-600" },
    { platform: "YouTube", icon: "📺", percentage: 10, color: "bg-red-600" },
  ];

  const getTopColor = (rank: number) => {
    if (rank === 1) return 'from-pink-500 to-pink-600';
    if (rank === 2) return 'from-pink-400 to-pink-500';
    if (rank === 3) return 'from-pink-300 to-pink-400';
    return 'from-purple-400 to-purple-500';
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const topBrands = rankings.slice(0, 3).map(r => ({
    name: r.brand,
    value: parseFloat(r.percentage),
    color: getTopColor(r.rank),
  }));

  const insights = [
    {
      icon: "🍔",
      title: "Líderes del Mercado",
      description: "Wendys y Freakie Dogs dominan con casi el 50% del share de reacciones",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: "📊",
      title: "Tendencia de Crecimiento",
      description: "Las marcas locales están ganando terreno frente a las franquicias internacionales",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "💬",
      title: "Engagement Alto",
      description: "El contenido de promociones especiales genera 3x más interacción",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🎯",
      title: "Oportunidades",
      description: "Las marcas en posiciones 4-10 tienen potencial de crecer mejorando su estrategia digital",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-500 via-pink-400 to-purple-500 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wider">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-white to-cyan-200">
                    FOODTALK
                  </span>
                </h1>
                <p className="text-xl md:text-2xl font-light tracking-wide">
                  digital insights
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Monitoreamos lo que mueve al consumidor en el sector de restaurantes
                </h2>
                
                <div className="flex flex-wrap justify-center gap-4 text-lg md:text-xl">
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    📊 Promociones
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    💬 Contenido
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    👑 Líderes del mercado
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    📈 Tendencias de consumo
                  </span>
                </div>

                <p className="text-xl max-w-3xl mx-auto mt-8">
                  Lleva tu marca al siguiente nivel, escríbenos a{' '}
                  <a 
                    href="mailto:info@digitalinsightsla.com" 
                    className="font-bold underline hover:text-pink-200 transition-colors"
                  >
                    info@digitalinsightsla.com
                  </a>
                </p>
              </div>

              <div className="mt-12 flex justify-center space-x-6">
                <div className="text-4xl">📱</div>
                <div className="text-4xl">📸</div>
                <div className="text-4xl">🎵</div>
                <div className="text-4xl">💼</div>
                <div className="text-4xl">📺</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Top Rankings Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Botón de actualización */}
            <div className="text-center mb-4">
              <button
                onClick={fetchRankings}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? '🔄 Cargando...' : '🔄 Actualizar Datos'}
              </button>
              {lastUpdate && (
                <p className="text-sm text-gray-500 mt-2">
                  Última actualización: {lastUpdate}
                </p>
              )}
            </div>

            <div className="text-center mb-12">
              <div className="inline-block">
                <span className="text-6xl md:text-8xl font-bold text-gray-200">
                  Top
                </span>
                <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent ml-4">
                  10
                </span>
              </div>
              
              <div className="mt-6">
                <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold">
                  Food Talk
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mt-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Share de reacciones
              </h2>
              <p className="text-gray-600 mt-2">1-15 septiembre</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="mt-4 text-gray-600">Cargando datos...</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rankings.map((item) => (
                    <div
                      key={item.rank}
                      className={`relative bg-gradient-to-r ${getTopColor(item.rank)} text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                            <span className="text-2xl font-bold">{item.rank}</span>
                          </div>
                          
                          {getMedalEmoji(item.rank) && (
                            <span className="text-3xl">{getMedalEmoji(item.rank)}</span>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-3xl font-bold">{item.percentage}</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-semibold">{item.brand}</h3>
                        <p className="text-sm text-white/80 mt-1">
                          {item.reactions.toLocaleString()} reacciones
                        </p>
                      </div>

                      <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-white h-full rounded-full transition-all duration-1000"
                          style={{ width: item.percentage }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 italic">
                  *porcentaje generado por total de reacciones en las plataformas de las marcas /
                  el total de reacciones de la industria.*
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Market Insights Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Insights del Mercado
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Análisis en tiempo real del comportamiento digital en el sector restaurantes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${insight.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                    {insight.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    {insight.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  ¿Quieres insights personalizados para tu marca?
                </h3>
                <p className="text-white/90 text-lg mb-6">
                  Te ayudamos a entender qué funciona, por qué funciona y cómo replicarlo
                </p>
                <a
                  href="mailto:info@digitalinsightsla.com"
                  className="inline-block bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Contactar ahora →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Data Visualization Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Análisis de Datos
                </span>
              </h2>

              <div className="inline-flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setActiveView('chart')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeView === 'chart'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 Share por Marca
                </button>
                <button
                  onClick={() => setActiveView('platforms')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeView === 'platforms'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📱 Por Plataforma
                </button>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              {activeView === 'chart' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Top 3 Marcas - Share de Reacciones
                  </h3>
                  
                  {topBrands.map((brand, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 ${brand.color} rounded-full flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>
                          <span className="text-xl font-semibold text-gray-800">
                            {brand.name}
                          </span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          {brand.value.toFixed(2)}%
                        </span>
                      </div>
                      
                      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${brand.color} transition-all duration-1000 flex items-center justify-end pr-4`}
                          style={{ width: `${brand.value}%` }}
                        >
                          <span className="text-white font-semibold text-sm">
                            {brand.value.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
                    <div className="flex justify-center items-end space-x-4 h-64">
                      {topBrands.map((brand, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-full ${brand.color} rounded-t-lg transition-all duration-1000 hover:opacity-80`}
                            style={{ height: `${brand.value * 2.5}%` }}
                          ></div>
                          <div className="mt-3 text-center">
                            <p className="font-semibold text-sm text-gray-700">
                              #{index + 1}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {brand.value.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'platforms' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Distribución por Plataforma
                  </h3>
                  
                  {platformData.map((platform, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl">
                            {platform.icon}
                          </div>
                          <span className="text-xl font-semibold text-gray-800">
                            {platform.platform}
                          </span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          {platform.percentage}%
                        </span>
                      </div>
                      
                      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${platform.color} transition-all duration-1000`}
                          style={{ width: `${platform.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
                    <div className="flex justify-center items-center">
                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        {platformData.map((platform, index) => (
                          <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
                            <div className="text-3xl">{platform.icon}</div>
                            <div>
                              <p className="font-semibold text-sm">{platform.platform}</p>
                              <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                {platform.percentage}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 italic">
                Datos actualizados en tiempo real desde Google Sheets
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Período: 1-15 septiembre 2024
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}