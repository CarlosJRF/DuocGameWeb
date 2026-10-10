import useFormulario from "./useFormulario.js";
import ErrorCampo from "./ErrorCampo.jsx";
import { CATEGORIAS } from "./utilidades.js";

const VALORES_INICIALES = { nombre: "", categoria: "", precio: "", descripcion: "", imagen: "" };

// Devuelve solo los campos con error
function validarVideojuego({ nombre, categoria, precio, descripcion, imagen }) {
    const errores = {};
    if (nombre.trim().length < 3) {
        errores.nombre = "Ingresa un nombre de al menos 3 caracteres.";
    }
    if (!CATEGORIAS.includes(categoria)) {
        errores.categoria = "Selecciona una categoría.";
    }
    const precioNumero = Number(precio);
    if (!Number.isInteger(precioNumero) || precioNumero <= 0) {
        errores.precio = "Ingresa un precio entero mayor a 0 (en pesos, sin puntos).";
    }
    if (descripcion.trim().length < 10) {
        errores.descripcion = "La descripción debe tener al menos 10 caracteres.";
    }
    if (imagen.trim() !== "" && !/^https?:\/\/\S+$/.test(imagen.trim())) {
        errores.imagen = "La URL debe comenzar con http:// o https://.";
    }
    return errores;
}

/**
 * Formulario para publicar un nuevo videojuego en el catálogo.
 * Valida los datos antes de enviarlos y se limpia tras publicar.
 *
 * Props:
 * - onPublicar(videojuego): recibe { nombre, categoria, precio, descripcion, imagen } ya validados
 */
export default function FormularioVideojuego({ onPublicar }) {
    const { idDe, errorDe, propsCampo, manejarSubmit, intentoEnvio, esValido } =
        useFormulario(VALORES_INICIALES, validarVideojuego, "videojuego");

    function publicar(valores) {
        onPublicar({
            nombre: valores.nombre.trim(),
            categoria: valores.categoria,
            precio: Number(valores.precio),
            descripcion: valores.descripcion.trim(),
            imagen: valores.imagen.trim(),
        });
    }

    return (
        <form className="row g-3" noValidate onSubmit={manejarSubmit(publicar)}>
            {intentoEnvio && !esValido && (
                <div className="col-12">
                    <div className="alert alert-danger mb-0" role="alert">
                        Revisa los campos marcados en rojo antes de publicar.
                    </div>
                </div>
            )}

            <div className="col-12">
                <label htmlFor={idDe("nombre")} className="form-label">Nombre</label>
                <input type="text" maxLength={60} {...propsCampo("nombre")} />
                <ErrorCampo id={idDe("nombre")} error={errorDe("nombre")} />
            </div>

            <div className="col-sm-6">
                <label htmlFor={idDe("categoria")} className="form-label">Categoría</label>
                <select {...propsCampo("categoria", "form-select")}>
                    <option value="">Selecciona...</option>
                    {CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                </select>
                <ErrorCampo id={idDe("categoria")} error={errorDe("categoria")} />
            </div>

            <div className="col-sm-6">
                <label htmlFor={idDe("precio")} className="form-label">Precio (CLP)</label>
                <input type="number" min="1" step="1" inputMode="numeric" {...propsCampo("precio")} />
                <ErrorCampo id={idDe("precio")} error={errorDe("precio")} />
            </div>

            <div className="col-12">
                <label htmlFor={idDe("descripcion")} className="form-label">Descripción</label>
                <textarea rows={2} maxLength={200} {...propsCampo("descripcion")} />
                <ErrorCampo id={idDe("descripcion")} error={errorDe("descripcion")} />
            </div>

            <div className="col-12">
                <label htmlFor={idDe("imagen")} className="form-label">
                    URL de la portada <span className="text-body-secondary">(opcional)</span>
                </label>
                <input type="url" placeholder="https://..." {...propsCampo("imagen")} />
                <ErrorCampo id={idDe("imagen")} error={errorDe("imagen")} />
            </div>

            <div className="col-12">
                <button type="submit" className="btn btn-warning">Publicar videojuego</button>
            </div>
        </form>
    );
}
