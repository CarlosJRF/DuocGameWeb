import TarjetaVideojuego from "./TarjetaVideojuego.jsx";

/**
 * Listado del catálogo. Según el estado muestra un spinner de carga,
 * un mensaje de error con botón "Reintentar", un aviso de "sin resultados"
 * o la grilla de tarjetas de videojuegos.
 *
 * Props:
 * - videojuegos: videojuegos a mostrar (ya filtrados)
 * - loading: true mientras se consulta la API
 * - error: mensaje de error o null
 * - carrito: items del carrito, para saber qué videojuegos ya están agregados
 * - onAgregar(videojuego): agrega un videojuego al carrito
 * - onEliminar(videojuego): quita un videojuego del catálogo
 * - onReintentar(): vuelve a consultar la API
 */
export default function ListaVideojuegos({ videojuegos, loading, error, carrito, onAgregar, onEliminar, onReintentar }) {
    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center my-5">
                <div className="spinner-border text-warning mb-3" role="status" aria-hidden="true"></div>
                <span>Cargando videojuegos...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3" role="alert">
                <span>{error}</span>
                <button type="button" className="btn btn-outline-danger" onClick={onReintentar}>
                    Reintentar
                </button>
            </div>
        );
    }

    if (videojuegos.length === 0) {
        return (
            <p className="text-center text-body-secondary my-4">
                No hay videojuegos que coincidan con el filtro o la búsqueda.
            </p>
        );
    }

    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {videojuegos.map((videojuego) => (
                <TarjetaVideojuego
                    key={videojuego.id}
                    videojuego={videojuego}
                    enCarrito={carrito.some((item) => item.id === videojuego.id)}
                    onAgregar={onAgregar}
                    onEliminar={onEliminar}
                />
            ))}
        </div>
    );
}
