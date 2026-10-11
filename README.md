# DuocGameWeb

Tienda online (simulada, con fines estudiantiles) de videojuegos OpenSource creados por estudiantes.
Muestra el catálogo en tarjetas, permite filtrar por categoría, gestionar un carrito de compras,
publicar nuevos videojuegos en el catálogo y escribirle al administrador con un formulario de contacto validado.

**Sitio publicado:** https://carlosjrf.github.io/DuocGameWeb/

## Funcionalidades

- **Catálogo dinámico**: las tarjetas (imagen, nombre, categoría, precio y descripción) se generan con React a partir de los datos de la API.
- **Filtro por categoría**: botones Todas / Acción / Aventura / Deportes / Estrategia, con la cantidad de juegos de cada una.
- **Búsqueda** por nombre o descripción desde la barra de navegación.
- **Carrito de compras**: agregar, sumar, restar y quitar videojuegos; contador en la barra de navegación y total. Se guarda en `localStorage`, así que sobrevive a recargas.
- **Publicar videojuegos** en el catálogo con un formulario validado (los juegos publicados duran mientras la página esté abierta).
- **Formulario de contacto** (nombre, email, mensaje) que valida los datos antes de enviarlos y muestra el error de cada campo.
- **Avisos (Toast)** no invasivos en la esquina inferior derecha al agregar o quitar productos, publicar un juego o enviar un mensaje.
- **Estados de carga y error**: spinner mientras llega el catálogo y mensaje con botón "Reintentar" si la API falla.
- **Diseño responsivo** con Bootstrap 5 (grilla de 1 a 4 columnas, menú colapsable en móvil).

## Tecnologías

| Parte | Tecnologías |
|---|---|
| Frontend | React 19, Vite, Bootstrap 5, CSS propio |
| Backend | Node.js, Express 5, CORS |
| Publicación | GitHub Actions + GitHub Pages |

## Estructura del proyecto

```text
DuocGameWeb/
├── backend/                  API REST (Express)
│   ├── data/videojuegos.json Catálogo de videojuegos
│   └── server.js             GET /api/videojuegos
├── frontend/                 Aplicación React (Vite)
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx          Punto de entrada (Bootstrap + estilos + <App />)
│       ├── App.jsx           Estado principal y composición de la página
│       ├── assets/           Estilos (css/) e imágenes (imagenes/)
│       └── components/
│           ├── BarraNavegacion.jsx      Navegación, búsqueda y botón del carrito
│           ├── FiltroCategorias.jsx     Botones de filtro por categoría
│           ├── ListaVideojuegos.jsx     Carga / error / grilla de tarjetas
│           ├── TarjetaVideojuego.jsx    Tarjeta de un videojuego
│           ├── Carrito.jsx              Panel lateral del carrito
│           ├── FormularioVideojuego.jsx Publicar un videojuego en el catálogo
│           ├── FormularioContacto.jsx   Formulario de contacto validado
│           ├── Notificaciones.jsx       Avisos Toast
│           ├── PiePagina.jsx            Pie de página
│           ├── useFormulario.js         Hook de validación de formularios
│           ├── ErrorCampo.jsx           Mensaje de error de un campo
│           └── utilidades.js            Categorías, formato de precios, imágenes
└── .github/workflows/pages.yml  Compila y publica el frontend en GitHub Pages
```

## Cómo ejecutarlo en local

Requisitos: [Node.js](https://nodejs.org/) 20 o superior.

1. Clona el repositorio:

   ```bash
   git clone https://github.com/CarlosJRF/DuocGameWeb.git
   cd DuocGameWeb
   ```

2. En una terminal, inicia el **backend** (queda en http://localhost:3000):

   ```bash
   cd backend
   npm install
   npm start
   ```

3. En otra terminal, inicia el **frontend** (queda en http://localhost:5173):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Abre http://localhost:5173 en el navegador.

> Si el backend está apagado, el catálogo muestra un mensaje de error con el botón **Reintentar**.

## API

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/videojuegos` | Lista de videojuegos: `{ id, nombre, categoria, precio, descripcion, imagen }` |

La respuesta tiene un retardo de 1 segundo a propósito, para que se vea el estado de carga.

## Publicación en GitHub Pages

Cada push a `main` ejecuta el workflow `.github/workflows/pages.yml`, que:

1. Compila el frontend con `npm run build`.
2. Copia `backend/data/videojuegos.json` como `api/videojuegos.json` dentro del sitio (Pages solo sirve archivos estáticos, no puede ejecutar Express).
3. Publica la carpeta `frontend/dist` en GitHub Pages.

En el sitio publicado el catálogo se lee de ese archivo JSON, por eso no hay retardo de carga.
