# IGRP Performance & Industrial — Web Oficial

Sitio web oficial de la marca **IGRP Performance & Industrial**, diseñado y desarrollado en HTML, CSS y JavaScript vanilla. Sin frameworks. Sin dependencias. Optimizado para Lighthouse 90+.

---

## Estructura del proyecto

```
igrp-web/
│
├── index.html              # HTML principal — limpio, sin inline CSS/JS
│
├── css/
│   ├── styles.css          # Todos los estilos: tokens, componentes, animaciones
│   └── responsive.css      # Media queries: tablet (1024px) y móvil (640px)
│
├── js/
│   └── main.js             # JavaScript completo: nav, countdown, galería, lightbox
│
├── assets/
│   ├── logo.svg            # Logo oficial vectorial (preferido)
│   ├── logo.png            # Logo PNG (fallback y favicon)
│   ├── og-image.jpg        # Imagen Open Graph (1200×630 px)
│   ├── hero/               # Imágenes de fondo del hero (si aplica en el futuro)
│   ├── products/           # Galería de producto
│   │   ├── belt-front.webp
│   │   ├── belt-back.webp
│   │   ├── belt-side.webp
│   │   ├── belt-detail.webp
│   │   ├── belt-sport.webp
│   │   └── belt-industrial.webp
│   ├── instagram/          # Galería de Instagram (alias de /assets/social/)
│   │   ├── 01.webp … 06.webp
│   └── icons/              # Íconos PWA
│       ├── icon-192.png
│       └── icon-512.png
│
├── robots.txt              # Directivas para crawlers
├── sitemap.xml             # Mapa del sitio para SEO
├── manifest.json           # Web App Manifest (PWA)
└── README.md               # Este archivo
```

---

## Imágenes requeridas

Antes de publicar, coloca estos archivos en sus rutas correspondientes:

| Archivo | Ruta | Tamaño recomendado |
|---|---|---|
| Logo vectorial | `/assets/logo.svg` | — |
| Logo PNG | `/assets/logo.png` | mín. 300×100 px, fondo transparente |
| Open Graph | `/assets/og-image.jpg` | exactamente 1200×630 px |
| Producto frontal | `/assets/products/belt-front.webp` | 800×1000 px |
| Producto trasero | `/assets/products/belt-back.webp` | 800×1000 px |
| Producto lateral | `/assets/products/belt-side.webp` | 800×1000 px |
| Detalle material | `/assets/products/belt-detail.webp` | 800×1000 px |
| Uso deportivo | `/assets/products/belt-sport.webp` | 800×1000 px |
| Uso industrial | `/assets/products/belt-industrial.webp` | 800×1000 px |
| Instagram 1–6 | `/assets/instagram/01.webp` … `06.webp` | 600×600 px |
| Ícono PWA 192 | `/assets/icons/icon-192.png` | 192×192 px |
| Ícono PWA 512 | `/assets/icons/icon-512.png` | 512×512 px |

> **Formato de imágenes:** WebP para todas las imágenes de contenido. El logo puede ser SVG (preferido) o PNG.

---

## Desarrollo local

No requiere ninguna instalación. Abre el proyecto con cualquier servidor local:

```bash
# Con Python (incluido en macOS y Linux)
cd igrp-web
python3 -m http.server 8080
# → http://localhost:8080

# Con Node.js (si lo tienes instalado)
npx serve .
# → http://localhost:3000

# Con VS Code
# Instala la extensión "Live Server" y haz clic en "Go Live"
```

> **Importante:** Abrir `index.html` directamente desde el sistema de archivos (`file://`) puede causar errores con las imágenes. Siempre usa un servidor local.

---

## Despliegue en Netlify

### Opción A — Arrastrar y soltar

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Arrastra la carpeta `igrp-web/` al área de deploy
3. Netlify publica el sitio automáticamente

### Opción B — Desde GitHub

1. Sube el proyecto a un repositorio en GitHub
2. En Netlify: **Add new site → Import an existing project**
3. Selecciona el repositorio
4. Configuración de build:
   - **Build command:** *(dejar vacío — no hay build)*
   - **Publish directory:** `.` *(o el nombre de la carpeta raíz)*
5. Haz clic en **Deploy site**

### Dominio personalizado (igrp.com.mx)

1. En Netlify: **Site settings → Domain management → Add domain**
2. Escribe `igrp.com.mx`
3. En tu registrador (Akky): actualiza los nameservers a los de Netlify, o agrega un registro `CNAME` apuntando a tu URL de Netlify
4. Netlify provisiona HTTPS automáticamente con Let's Encrypt

---

## Despliegue en Cloudflare Pages

### Desde GitHub

1. Sube el proyecto a GitHub
2. Ve a [pages.cloudflare.com](https://pages.cloudflare.com)
3. **Create a project → Connect to Git**
4. Selecciona el repositorio
5. Configuración:
   - **Framework preset:** None
   - **Build command:** *(dejar vacío)*
   - **Build output directory:** `/` *(raíz del repo)*
6. Haz clic en **Save and Deploy**

### Dominio personalizado

1. En Cloudflare Pages: **Custom domains → Set up a custom domain**
2. Escribe `igrp.com.mx`
3. Si tu dominio ya está en Cloudflare DNS, el registro se crea automáticamente
4. Si no, Cloudflare te guiará para agregar los registros DNS necesarios

---

## Despliegue en GitHub Pages

1. Sube el proyecto a un repositorio público en GitHub (ej. `igrp-web`)
2. Ve a **Settings → Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` — **Folder:** `/ (root)`
5. Haz clic en **Save**
6. El sitio estará en `https://tu-usuario.github.io/igrp-web/`

> **Nota sobre rutas:** GitHub Pages sirve desde una subcarpeta. Si las rutas de imágenes usan `/assets/...` (absolutas desde la raíz), agrega un archivo `_config.yml` con `baseurl: "/igrp-web"`, o usa rutas relativas como `./assets/...` en el HTML.
>
> Para producción en `igrp.com.mx` con GitHub Pages, configura un dominio personalizado en **Settings → Pages → Custom domain**.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura y accesibilidad WCAG AA |
| CSS3 custom properties | Sistema de tokens de diseño IGRP |
| JavaScript ES6+ vanilla | Interactividad sin frameworks |
| WebP | Imágenes optimizadas |
| Schema.org JSON-LD | SEO estructurado |
| Open Graph / Twitter Cards | Metadatos sociales |
| Web App Manifest | Soporte PWA básico |

---

## Optimizaciones incluidas

- `fetchpriority="high"` en imagen LCP (primera foto del producto)
- `loading="lazy"` en todas las imágenes no críticas
- `decoding="async"` en todas las imágenes
- `width` y `height` declarados en todas las imágenes (cero CLS)
- `preconnect` a Google Fonts para reducir latency
- Scroll Reveal con IntersectionObserver (sin scroll listeners)
- `{ passive: true }` en listeners de scroll
- `defer` en el script principal

---

## Marca registrada

IGRP® — Marca Registrada ante el IMPI  
Clase 25 — Folio 263194  
Monterrey, Nuevo León, México

© 2025 IGRP Performance & Industrial. Todos los derechos reservados.
