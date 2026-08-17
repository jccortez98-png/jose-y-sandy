# 💍 Invitación Digital de Boda — José & Sandy

Invitación digital interactiva *mobile-first* de alta gama diseñada con el 100% de fidelidad estética a la referencia (tipografías clásicas románticas, paleta en azul marino profundo y blanco marfil, follaje botánico e ilustraciones de línea fina).

Incluye todas las herramientas para gestionar datos, enlaces e invitados:
- ⚙️ **Panel de Administración (`admin.html`)**: Editor visual completo para modificar textos, fotos, horarios, cuentas bancarias, itinerario y enlaces de mapas en vivo.
- 👥 **Gestor de Invitados (`guest-manager.html`)**: Importación de Excel/CSV, generador de URLs personalizadas con pases asignados y mensajes listos para WhatsApp.
- 💌 **Apertura de Sobre Digital y Sello de Lacre `JS`** interactivo.
- ⏳ **Cuenta Regresiva en tiempo real** al 28 de Noviembre de 2026.
- 📅 **Agendar en Google Calendar & descarga iCal** (Apple / Outlook) con un solo clic.
- 📍 **Modal de Navegación** con enlaces directos a **Waze**, **Google Maps** y **Apple Maps**.
- ⏱️ **Itinerario de boda** con iconos lineales elegantes y línea de tiempo vertical.
- 👗 **Código de Vestimenta (Formal)** y reglas del evento (Adultos solamente).
- 🎁 **Mesa de Regalos & Cuentas Bancarias** con botón interactivo para **Copiar Cuenta en 1 clic** y confirmación visual.
- 📸 **Galería de Fotos ("Nuestros Momentos")** con visor interactivo *lightbox*.
- ✉️ **RSVP Personalizado por Invitado**: Reconocimiento dinámico de pases y nombre por enlace (`?invitado=...&pases=...`) y generación automática de mensajes para WhatsApp.
- 🎵 **Música de fondo ambiental** suave con control flotante interactivo.

---

## 📁 Estructura del Proyecto

```
proyecto_invitaciones/
├── index.html                  # Invitación digital principal
├── admin.html                  # Panel de administración visual de datos, textos, fotos y URLs
├── guest-manager.html          # Herramienta visual para generar enlaces y gestionar invitados
├── data/
│   ├── invitation-data.json    # Configuración centralizada de textos, novios, cuentas y fechas
│   └── guests-example.csv      # Plantilla CSV/Excel de ejemplo con nombres y pases
├── assets/
│   ├── css/
│   │   ├── style.css           # Estilos visuales 100% fieles a la referencia
│   │   ├── envelope.css        # Animación del sobre y sello de lacre
│   │   ├── admin.css           # Estilos del panel de administración
│   │   └── guest-manager.css   # Estilos del gestor de invitados
│   ├── js/
│   │   ├── app.js              # Lógica interactiva principal y enlace de datos dinámicos
│   │   ├── admin.js            # Lógica del panel de administración y exportador JSON
│   │   ├── calendar.js         # Generador de enlaces a Google Calendar y archivo .ics
│   │   └── guest-manager.js    # Módulo de importación Excel/CSV y generador masivo
│   ├── images/
│   │   ├── couple-hero.jpg     # Foto principal de portada
│   │   ├── couple-closing.jpg  # Foto final de despedida
│   │   ├── gallery-1.jpg       # Foto detalle de anillos
│   │   └── gallery-2.jpg       # Foto romántica galería
│   └── icons/                  # Iconos vectoriales y follaje botánico (SVG)
└── scripts/
    └── generate_links.py       # Script en Python para procesar listas desde terminal
```

---

## ⚙️ Cómo Usar el Panel de Administración (`admin.html`)

1. Abre [`admin.html`](file:///Users/joseherrera/Desktop/proyecto_invitaciones/admin.html) en tu navegador.
2. Navega por las diferentes pestañas:
   - **💍 Novios & Contacto**: Nombres, teléfonos de WhatsApp para confirmaciones, monograma.
   - **📅 Fecha & Horarios**: Días, horarios de ceremonia/recepción, fecha límite de RSVP.
   - **✍️ Textos & Frases**: Modifica cualquier frase, lema o bendición.
   - **📍 Ubicaciones & Mapas**: Configura los nombres de lugares y enlaces a Waze / Google Maps / Apple Maps.
   - **⏱️ Itinerario**: Agrega, elimina o edita momentos del evento con sus horarios e iconos.
   - **👗 Protocolo & Reglas**: Dress code, notas de niños/adultos y mesa de regalos.
   - **💳 Cuentas Bancarias**: Agrega o edita las cuentas bancarias para transferencias.
   - **📸 Fotos & Galería**: Cambia la foto de portada, de cierre o sube imágenes a la galería.
3. Haz clic en **💾 Guardar Cambios** para que la invitación en vivo se actualice inmediatamente en tu navegador.
4. Haz clic en **📥 Descargar JSON** si deseas guardar una copia definitiva del archivo `invitation-data.json` para tu servidor o repositorio.

---

## 💌 Cómo Generar Enlaces Personalizados para Cada Invitado

1. Abre [`guest-manager.html`](file:///Users/joseherrera/Desktop/proyecto_invitaciones/guest-manager.html).
2. Pega tu lista de invitados desde Excel o sube tu archivo `.csv`.
3. Haz clic en **Copiar Link** o en **WhatsApp** para enviar la invitación personalizada directamente al invitado.

---

## 🚀 Cómo Probar Localmente

Puedes iniciar el servidor local:
```bash
ruby -run -ehttpd . -p8080
```
Luego abre en tu navegador:
- **Invitación Principal**: `http://localhost:8080/index.html`
- **Panel de Administración**: `http://localhost:8080/admin.html`
- **Gestor de Invitados**: `http://localhost:8080/guest-manager.html`
- **Invitación con Invitado Personalizado**: `http://localhost:8080/index.html?invitado=Familia+P%C3%A9rez+G%C3%B3mez&pases=4`
