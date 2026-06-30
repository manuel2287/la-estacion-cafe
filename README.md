# La Estación Café - Sitio Web

Sitio web completo para **La Estación Café**, una cafetería de especialidad ubicada en Santa Fe, Argentina. Proyecto desarrollado como trabajo práctico de Desarrollo de Sistemas Web (DSW) 2026.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js** (versión 14.0 o superior)
- **npm** (incluido con Node.js)
- Un editor de código (VS Code recomendado)
- Un navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🚀 Instalación Paso a Paso

### 1. Clonar o Descargar el Repositorio

```bash
# Si tienes Git instalado, clona el repositorio
git clone <URL_DEL_REPOSITORIO>
cd la-estacion-cafe
```

O descarga el archivo ZIP y extrae el contenido.

### 2. Instalar Dependencias

En la carpeta del proyecto, abre una terminal y ejecuta:

```bash
npm install
```

Esto instalará:

- **Bootstrap 5.3.3** - Framework CSS
- **Sass** - Compilador de estilos
- **Live Server** - Servidor de desarrollo con recarga automática

### 3. Compilar Estilos SCSS

Los estilos están escritos en SCSS. Para compilarlos a CSS:

```bash
npm run build:css
```

O para compilar automáticamente mientras trabajas:

```bash
npm run watch:css
```

### 4. Iniciar el Servidor de Desarrollo

En otra terminal, ejecuta:

```bash
npm run serve
```

El sitio se abrirá automáticamente en `http://localhost:5500`

## 📂 Estructura del Proyecto

```
la-estacion-cafe/
├── index.html              # Página de inicio
├── carta.html              # Menú de la cafetería
├── reservas.html           # Página de reservas
├── tienda.html             # Tienda online
├── detalle-pedido.html     # Detalle del pedido/carrito
├── contacto.html           # Contacto y ubicación
├── css/
│   ├── styles.css          # Estilos compilados desde SCSS
│   ├── styles.css.map      # Source map de estilos
│   └── overrides.css       # Ajustes puntuales cargados después del CSS principal
├── img/
│   ├── logo_laestacion.svg
│   ├── logo_laestacion_mobile.svg
│   ├── logo_laestacion_white.svg
│   ├── productos-cafe/     # Imágenes de productos de la carta
│   └── productos-tienda/   # Imágenes de productos de la tienda
├── js/
│   ├── main.js             # Inicialización general de módulos
│   └── modules/
│       ├── add-cart-buttons.js   # Agregado de productos al carrito
│       ├── bootstrap-ui.js       # Integraciones de Bootstrap
│       ├── cart-header-link.js   # Icono/contador del carrito en el header
│       ├── cart-store.js         # Persistencia del carrito en localStorage
│       ├── filters.js            # Filtros de carta y tienda
│       ├── format.js             # Helpers de formato
│       ├── order-detail.js       # Render y acciones del detalle de pedido
│       ├── products.js           # Lectura de datos desde botones de producto
│       ├── reservations.js       # Formulario de reservas
│       └── toasts.js             # Notificaciones
├── scss/                   # Estilos en SCSS
│   ├── styles.scss         # Archivo principal
│   ├── abstracts/
│   │   └── _variables.scss # Variables de color y tipografía
│   ├── base/
│   │   └── _base.scss      # Estilos base y tipografía
│   ├── components/
│   │   ├── _buttons.scss   # Estilos de botones
│   │   ├── _cards.scss     # Estilos de tarjetas
│   │   ├── _header.scss    # Encabezado
│   │   ├── _footer.scss    # Pie de página
│   │   └── _toast.scss     # Notificaciones
│   └── pages/
│       ├── _home.scss      # Estilos de inicio
│       ├── _carta.scss     # Estilos de menú
│       ├── _reservas.scss  # Estilos de reservas
│       ├── _tienda.scss    # Estilos de tienda
│       ├── _detalle-pedido.scss # Estilos del detalle de pedido
│       └── _contacto.scss  # Estilos de contacto
├── package.json            # Configuración del proyecto
├── package-lock.json       # Versiones bloqueadas de dependencias
└── README.md              # Este archivo
```

## 🎨 Sistema de Diseño

### Paleta de Colores

| Color       | Código    | Uso                              |
| ----------- | --------- | -------------------------------- |
| Terracota   | `#B35431` | Color principal, botones, CTAs   |
| Verde Vagón | `#546A5B` | Color secundario, acentos        |
| Arpillera   | `#D1C4B5` | Fondos suaves, badges            |
| Hierro      | `#38251B` | Texto oscuro, títulos            |
| Botánico    | `#4A7C59` | Mensajes positivos, validaciones |
| Café        | `#4E3B32` | Texto body, secundario           |
| Polvo       | `#8C7A6B` | Badges, elementos terciarios     |
| Lienzo      | `#E6DED5` | Fondos alternos                  |
| Crema       | `#F4EDE4` | Fondo principal                  |

### Tipografía

- **Títulos (H1-H3)**: Lora, Bold, Tracking -2%
- **Subtítulos**: Lora, Medium
- **Texto Body**: Montserrat, Medium, 16px
- **Etiquetas**: Montserrat, Bold, 10px, Tracking 3%
- **Botones**: Montserrat, Bold, Tracking 3%

## 📝 Comandos Disponibles

```bash
# Compilar SCSS a CSS (una sola vez)
npm run build:css

# Compilar SCSS y detectar cambios automáticamente
npm run watch:css

# Iniciar servidor de desarrollo en localhost:5500
npm run serve

# Iniciar servidor en red local (para otros dispositivos)
npm run serve:host
```

## 🌐 Páginas Disponibles

### 1. **Inicio** (`index.html`)

- Hero con imagen de fondo
- Sección de productos destacados
- Galería de cafés
- Información de la marca
- CTA de reservas

### 2. **Nuestra Carta** (`carta.html`)

- Menú completo con filtros
- Sidebar con opciones de búsqueda
- Grilla 3x3 de productos con paginado
- Botones para agregar productos al pedido
- Acceso al detalle del pedido desde el icono del carrito cuando hay productos

### 3. **Reservas** (`reservas.html`)

- Formulario de reserva
- Panel lateral con información del local
- Políticas de cancelación
- CTA de WhatsApp

### 4. **Tienda Online** (`tienda.html`)

- Catálogo de productos para llevar
- Filtros por tipo de café, presentación y precio
- Cards con descripción y precio
- Carrito persistido en `localStorage`
- Acceso al detalle del pedido desde el icono del carrito cuando hay productos

### 5. **Detalle del Pedido** (`detalle-pedido.html`)

- Tabla con productos agregados desde la carta o la tienda
- Controles para sumar, restar y eliminar productos
- Resumen del total y campo para notas/promociones
- Confirmación y limpieza del pedido

### 6. **Contacto** (`contacto.html`)

- Mapa embebido con ubicación
- Preguntas frecuentes (FAQ)
- Datos de contacto
- CTA de WhatsApp

## 🔧 Cómo Editar

### Agregar una Nueva Página

1. Crea un archivo HTML en la raíz (ej: `eventos.html`)
2. Usa la estructura HTML del sitio como referencia
3. Importa `css/styles.css` en el `<head>`
4. Agrega la clase de página en el `<body>` (ej: `class="page-eventos"`)
5. Crea un archivo `_eventos.scss` en `scss/pages/`
6. Importa el archivo en `scss/styles.scss`
7. Ejecuta `npm run build:css` para compilar

### Modificar Colores

Edita `scss/abstracts/_variables.scss`:

```scss
$terracota: #b35431; // Cambiar color principal
$verde-vagon: #546a5b; // Cambiar color secundario
// ... otros colores
```

Luego ejecuta `npm run build:css`.

### Modificar Tipografía

En `scss/abstracts/_variables.scss`:

```scss
$type-h1-size: 64px; // Tamaño de H1
$type-body-size: 16px; // Tamaño de body
$font-family-serif: 'Lora', serif; // Fuente de títulos
$font-family-sans-serif: 'Montserrat', sans-serif; // Fuente body
```

## 📱 Responsive Design

El sitio es **100% responsive** y se adapta a:

- **Desktop**: 1366px y superior
- **Tablet**: 768px - 1365px
- **Mobile**: 320px - 767px

Las media queries están definidas en cada componente.

## 🔗 Enlaces Externos

- [Bootstrap 5.3 Documentación](https://getbootstrap.com/docs/5.3/)
- [Sass Documentación](https://sass-lang.com/)
- [MDN Web Docs](https://developer.mozilla.org/es/)

## 📧 Contacto y Soporte

Para reportar bugs o hacer sugerencias:

- Email: hola@laestacioncafe.com.ar
- WhatsApp: +54 342 000-0000
- Ubicación: Av. Gral. Paz 1234, Santa Fe, Argentina

## 📄 Licencia

Proyecto académico - Trabajo Práctico 2 de DSW 2026.

---

**Última actualización:** Junio 2026
**Versión:** 1.0.0
**Estado:** Producción ✅
