# E-Commerce - Tienda de Mascotas

Aplicación de e-commerce para venta de productos para mascotas, desarrollada con React + Vite y Firebase.

## Requisitos previos

- **Node.js** (v18 o superior)
- **npm** (incluido con Node.js)

## Instalación

1. **Clonar el repositorio o descargar el proyecto**

```bash
git clone <URL_DEL_REPOSITORIO>
cd ecommerce
```

2. **Instalar dependencias**

```bash
npm install
```

## Levantar el proyecto en desarrollo

Para ejecutar el servidor de desarrollo con HMR (Hot Module Replacement):

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173` (o el puerto indicado en la terminal).

## Compilar para producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados se guardarán en la carpeta `dist/`.

## Vista previa de producción

Para ver cómo se vería la aplicación en producción localmente:

```bash
npm run preview
```

## Estructura del proyecto

```
src/
├── components/
│   ├── cart/              # Componentes del carrito
│   ├── inicio/            # Página de inicio
│   ├── producto/          # Componentes de productos
│   ├── layout/            # Header, Footer, Layout
│   ├── formulario/        # Formularios
│   └── ...
├── context/               # Context API (CartContext)
├── service/               # Servicios (Firebase)
├── firebase/              # Configuración de Firebase
├── App.jsx
└── main.jsx
```

## Funcionalidades principales

- 🛍️ Visualización de productos en oferta en la página de inicio
- 🛒 Carrito de compras con gestión de cantidades
- ❤️ Sistema de favoritos
- 📱 Diseño responsivo
- 🔥 Integración con Firebase/Firestore
- Gestión de productos con descripción opcional, visible en el detalle del producto

## Configuración de Firebase

La configuración de Firebase se encuentra en `src/firebase/config.js`. Asegúrate de tener configuradas las credenciales de tu proyecto Firebase.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Visualiza la compilación de producción localmente |

## Notas importantes

- Los productos en oferta se muestran en la página de inicio si tienen el campo `oferta: true` en Firebase
- El carrito se sincroniza usando Context API
- Los logs de debugging se muestran en la consola del navegador (F12)
