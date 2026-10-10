import useFormulario from "./useFormulario.js";
import ErrorCampo from "./ErrorCampo.jsx";
import { PATRON_EMAIL } from "./utilidades.js";

const VALORES_INICIALES = { nombre: "", email: "", mensaje: "" };

// Devuelve solo los campos con error
function validarContacto({ nombre, email, mensaje }) {
    const errores = {};
    if (nombre.trim() === "") {
        errores.nombre = "El nombre es obligatorio.";
    } else if (nombre.trim().length < 3) {
        errores.nombre = "El nombre debe tener al menos 3 caracteres.";
    }
    if (email.trim() === "") {
        errores.email = "El email es obligatorio.";
    } else if (!PATRON_EMAIL.test(email.trim())) {
        errores.email = "Ingresa un email válido, por ejemplo nombre@correo.cl.";
    }
    if (mensaje.trim() === "") {
        errores.mensaje = "El mensaje es obligatorio.";
    } else if (mensaje.trim().length < 10) {
        errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    }
    return errores;
}

/**
 * Formulario de contacto con el administrador del sitio (nombre, email y mensaje).
 * Valida los datos antes de enviarlos y muestra el error de cada campo.
 *
 * Props:
 * - onEnviar({ nombre, email, mensaje }): recibe los datos ya validados
 */
export default function FormularioContacto({ onEnviar }) {
    const { idDe, errorDe, propsCampo, manejarSubmit, intentoEnvio, esValido } =
        useFormulario(VALORES_INICIALES, validarContacto, "contacto");

    return (
        <form noValidate onSubmit={manejarSubmit(onEnviar)}>
            {intentoEnvio && !esValido && (
                <div className="alert alert-danger" role="alert">
                    Faltan datos o hay datos mal ingresados. Revisa los campos marcados.
                </div>
            )}

            <div className="mb-3">
                <label htmlFor={idDe("nombre")} className="form-label">Nombre</label>
                <input type="text" autoComplete="name" maxLength={60} {...propsCampo("nombre")} />
                <ErrorCampo id={idDe("nombre")} error={errorDe("nombre")} />
            </div>

            <div className="mb-3">
                <label htmlFor={idDe("email")} className="form-label">Email</label>
                <input type="email" autoComplete="email" {...propsCampo("email")} />
                <ErrorCampo id={idDe("email")} error={errorDe("email")} />
            </div>

            <div className="mb-3">
                <label htmlFor={idDe("mensaje")} className="form-label">Mensaje</label>
                <textarea rows={4} maxLength={500} {...propsCampo("mensaje")} />
                <ErrorCampo id={idDe("mensaje")} error={errorDe("mensaje")} />
            </div>

            <button type="submit" className="btn btn-warning w-100">Enviar mensaje</button>
        </form>
    );
}
