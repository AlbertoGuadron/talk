# Guía: Conectar con Google Sheets

## Paso 1: Crear el Google Spreadsheet

1. Ve a [Google Sheets](https://sheets.google.com) y crea una hoja en blanco.
2. La URL será algo así: `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`
3. Copia el ID (la parte larga en el medio de la URL).

## Paso 2: Crear las pestañas (tabs)

Crea **6 pestañas** con exactamente estos nombres (respeta mayúsculas/minúsculas):

| Pestaña | Contenido |
|---------|-----------|
| `foodtalk_datos` | Datos del Excel de Foodtalk |
| `foodtalk_config` | Título y análisis de Foodtalk |
| `housetalk_datos` | Datos del Excel de Housetalk |
| `housetalk_config` | Título y análisis de Housetalk |
| `markettalk_datos` | Datos del Excel de Markettalk |
| `markettalk_config` | Título y análisis de Markettalk |

## Paso 3: Configurar las pestañas `_config`

En cada pestaña `_config`, escribe exactamente esto en las columnas A y B:

| A (columna A) | B (columna B - editar esto) |
|---|---|
| `titulo` | Foodtalk |
| `subtitulo` | Ranking de presencia en redes sociales |
| `mes` | Mayo 2026 |
| `analisis` | Escribe aquí tu análisis del mes... |

## Paso 4: Pegar los datos (cada mes)

En cada pestaña `_datos`, pega el contenido del Excel:
1. Abre el Excel del mes (ej. "Ranking Foodtalk May 2026.xlsx")
2. Ve a la hoja "Resumen de métricas"
3. Selecciona TODO (Ctrl+A) y copia (Ctrl+C)
4. Ve a Google Sheets → pestaña `foodtalk_datos`
5. **Borra todos los datos anteriores** (Ctrl+A, Delete)
6. Pega (Ctrl+V)

## Paso 5: Crear cuenta de servicio en Google Cloud

> Este paso lo hace una vez un desarrollador.

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo (o usa uno existente)
3. Activa la **Google Sheets API**: Menú → APIs y Servicios → Biblioteca → busca "Google Sheets API" → Activar
4. Ve a **Credenciales** → Crear credenciales → Cuenta de servicio
5. Rellena el nombre (ej. "talks-dashboard") → Crear y continuar → Listo
6. Haz clic en la cuenta creada → pestaña **Claves** → Agregar clave → JSON
7. Se descargará un archivo `.json` — guárdalo seguro

## Paso 6: Dar acceso al Spreadsheet

1. Abre el archivo `.json` descargado y copia el campo `client_email`
   (es algo como `talks-dashboard@mi-proyecto.iam.gserviceaccount.com`)
2. Ve a tu Google Spreadsheet
3. Clic en **Compartir** (arriba a la derecha)
4. Pega el `client_email` y dale permiso de **Lector**

## Paso 7: Configurar el .env.local

Edita el archivo `.env.local` en la raíz del proyecto:

```env
REVALIDATE_TOKEN=pon-aqui-un-texto-largo-secreto

GOOGLE_SPREADSHEET_ID=el-id-que-copiaste-en-el-paso-1

GOOGLE_SERVICE_ACCOUNT_EMAIL=el-client_email-del-json

GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABCD...\n-----END PRIVATE KEY-----\n"
```

> Para `GOOGLE_PRIVATE_KEY`: copia el campo `private_key` del JSON.
> Los saltos de línea deben quedar como `\n` en una sola línea.

---

## Flujo mensual (para no programadores)

Cada mes, el proceso es:

1. ✅ Abre el Google Sheets
2. ✅ Ve a `foodtalk_datos` → borra datos viejos → pega nuevos del Excel
3. ✅ Ve a `foodtalk_config` → actualiza `mes` (ej. "Mayo 2026") y `analisis`
4. ✅ Repite para housetalk y markettalk
5. ✅ Abre el sitio → `/admin` → presiona **Publicar cambios**
6. ✅ ¡Listo! El sitio se actualiza al instante.
