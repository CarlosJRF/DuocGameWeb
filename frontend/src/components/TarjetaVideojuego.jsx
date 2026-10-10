import { formateadorPrecio, obtenerImagen } from "./utilidades.js";

/**
 * Tarjeta de un videojuego del catálogo: portada, nombre, categoría, precio,
 * descripción, botón para agregar al carrito y botón para quitarlo del catálogo.
 *
 * Props:
 * - videojuego: { id, nombre, categoria, precio, descripcion, imagen }
 * - enCarrito: true si el videojuego ya está en el carrito
 * - onAgregar(videojuego): agrega el videojuego al carrito
 * - onEliminar(videojuego): quita el videojuego del catálogo
 */
export default function TarjetaVideojuego({ videojuego, enCarrito, onAgregar, onEliminar }) {
    return (
        <div className="col">
            <article className="card tarjeta-videojuego h-100">
                <img
                    src={obtenerImagen(videojuego.imagen)}
                    className="card-img-top"
                    alt={`Portada de ${videojuego.nombre}`}
                    loading="lazy"
                />

                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h3 className="card-title h5 mb-0">{videojuego.nombre}</h3>
                        <span className="badge text-bg-warning">{videojuego.categoria}</span>
                    </div>
                    <p className="card-text">{videojuego.descripcion}</p>

                    <div className="mt-auto">
                        <p className="precio mb-2">{formateadorPrecio.format(videojuego.precio)}</p>

                        {/* Si ya está en el carrito, el botón se desactiva para evitar duplicados */}
                        <button
                            type="button"
                            className={`btn w-100 ${enCarrito ? "btn-success" : "btn-warning"}`}
                            onClick={() => onAgregar(videojuego)}
                            disabled={enCarrito}
                        >
                            {enCarrito ? "En el carrito" : "Agregar al carrito"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-link btn-sm link-danger w-100 mt-1"
                            onClick={() => onEliminar(videojuego)}
                        >
                            Quitar del catálogo
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
}
