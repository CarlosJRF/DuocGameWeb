import { CATEGORIAS } from "./utilidades.js";

/**
 * Botones para filtrar el catálogo por categoría ("Todas" muestra todo).
 *
 * Props:
 * - categoriaSeleccionada: categoría activa, o "" para todas
 * - conteo: { [categoria]: cantidad de videojuegos }, y conteo.total
 * - onSeleccionar(categoria): cambia la categoría activa
 */
export default function FiltroCategorias({ categoriaSeleccionada, conteo, onSeleccionar }) {
    const opciones = [{ valor: "", etiqueta: "Todas", cantidad: conteo.total }].concat(
        CATEGORIAS.map((categoria) => ({ valor: categoria, etiqueta: categoria, cantidad: conteo[categoria] ?? 0 }))
    );

    return (
        <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar por categoría">
            {opciones.map(({ valor, etiqueta, cantidad }) => {
                const activa = categoriaSeleccionada === valor;
                return (
                    <button
                        key={etiqueta}
                        type="button"
                        className={`btn ${activa ? "btn-warning" : "btn-outline-warning"}`}
                        aria-pressed={activa}
                        onClick={() => onSeleccionar(valor)}
                    >
                        {etiqueta} <span className="badge text-bg-dark ms-1">{cantidad}</span>
                    </button>
                );
            })}
        </div>
    );
}
