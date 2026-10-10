/**
 * DuocGameWeb - Utilidades compartidas por los componentes React
 */
import portadaGenerica from "../assets/imagenes/portadaGenerica.svg";

// Categorías disponibles en la tienda (filtro y formulario de nuevo videojuego)
export const CATEGORIAS = ["Acción", "Aventura", "Deportes", "Estrategia"];

// Formateador de precios en pesos chilenos
export const formateadorPrecio = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
});

// Validación simple de email: algo@dominio.ext
export const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Vite resuelve en tiempo de build la URL final de cada imagen de la carpeta
const imagenes = import.meta.glob("../assets/imagenes/*.{jpg,svg}", {
    eager: true,
    import: "default",
});

/**
 * Devuelve la URL de la portada de un videojuego:
 * - una URL externa (http/https) se usa tal cual (videojuegos agregados por el usuario),
 * - un nombre de archivo de la API (ej. "Dune.jpg") se busca entre las imágenes locales,
 * - si no hay imagen, se usa una portada genérica.
 */
export function obtenerImagen(imagen) {
    if (!imagen) return portadaGenerica;
    if (/^https?:\/\//.test(imagen)) return imagen;
    return imagenes[`../assets/imagenes/${imagen}`] ?? portadaGenerica;
}
