# Talks Dashboard

Dashboard de rankings de presencia en redes sociales para Foodtalk, Housetalk y Markettalk.

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Páginas

| URL | Descripción |
|-----|-------------|
| `/` | Página principal |
| `/foodtalk` | Dashboard Foodtalk |
| `/housetalk` | Dashboard Housetalk |
| `/markettalk` | Dashboard Markettalk |
| `/admin` | Panel de administrador |

## Modo demo vs. Google Sheets

- **Sin configurar**: el sitio muestra los datos del Excel de demo (Abril 2026).
- **Con Google Sheets**: datos en tiempo real desde el spreadsheet.

Ver **GUIA-GOOGLE-SHEETS.md** para instrucciones de configuración.

## Agregar un nuevo Talk

1. Agrega la configuración en `lib/talks-config.ts`
2. Crea `app/[nombre-talk]/page.tsx` copiando cualquier Talk existente
3. Agrega los datos demo en `lib/demo-data/[nombre].json`
4. Crea las pestañas `[nombre]_datos` y `[nombre]_config` en Google Sheets

## Variables de entorno (.env.local)

```env
REVALIDATE_TOKEN=texto-secreto-largo
GOOGLE_SPREADSHEET_ID=id-del-spreadsheet
GOOGLE_SERVICE_ACCOUNT_EMAIL=email@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

## Publicar en Vercel

1. Conecta este repositorio en [vercel.com](https://vercel.com)
2. Agrega las variables de entorno en el dashboard de Vercel
3. Deploy automático en cada `git push`
