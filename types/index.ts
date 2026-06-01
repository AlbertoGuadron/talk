export type TalkSlug = "foodtalk" | "housetalk" | "markettalk" | "retailtalk";

export interface TalkConfig {
  slug: TalkSlug;
  label: string;
  description: string;
  color: string;
  colorLight: string;
  bgGradient: string;
  icon: string;
  hasCategoria?: boolean;
}

export interface TalkMeta {
  titulo: string;
  subtitulo: string;
  mes: string;
  analisis: string;
  analisis2?: string;
  analisis3?: string;
}

export interface ProfileData {
  profile: string;
  network: string;
  categoria: string;
  seguidores: number;
  publicaciones: number;
  likes: number;
  comentarios: number;
  compartidos: number;
  engagement: number;
  impresiones: number;
  crecimientoSeguidores?: number;
  valorPublicitario?: number;
}

export interface PostData {
  date: string;
  message: string;
  categoria: string;
  profile: string;
  network: string;
  engagement: number;
  link: string;
  imageLink: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  network?: string;
  categoria?: string;
  fill?: string;
}

export interface TalkDashboardData {
  meta: TalkMeta;
  profiles: ProfileData[];
  // Top 10 rankings
  topPublicaciones: ChartDataPoint[];
  topReacciones: ChartDataPoint[];
  topSeguidores: ChartDataPoint[];
  // Por plataforma (sumas)
  porRedPublicaciones: ChartDataPoint[];
  porRedReacciones: ChartDataPoint[];
  porRedSeguidores: ChartDataPoint[];
  // Por categoría (solo talks con categoría)
  porCategoriaPublicaciones?: ChartDataPoint[];
  porCategoriaReacciones?: ChartDataPoint[];
  porCategoriaSeguidores?: ChartDataPoint[];
  topPosts: PostData[];
  stats: {
    totalPerfiles: number;
    totalSeguidores: number;
    totalPublicaciones: number;
    totalReacciones: number;
  };
}
