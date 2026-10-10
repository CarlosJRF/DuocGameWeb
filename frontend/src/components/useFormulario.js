import { useState } from "react";

/**
 * Hook para formularios controlados con validación.
 *
 * - valoresIniciales: { campo: valor }
 * - validar(valores): devuelve { campo: "mensaje de error" } solo con los campos inválidos
 * - prefijo: antepuesto a los id de los campos, para que no choquen entre formularios
 *
 * Los errores de un campo se muestran cuando el usuario sale de él (blur)
 * o tras el primer intento de envío, para no marcar en rojo mientras se escribe.
 */
export default function useFormulario(valoresIniciales, validar, prefijo) {
    const [valores, setValores] = useState(valoresIniciales);
    const [tocados, setTocados] = useState({});
    const [intentoEnvio, setIntentoEnvio] = useState(false);

    const errores = validar(valores);
    const esValido = Object.keys(errores).length === 0;

    function manejarCambio(evento) {
        const { name, value } = evento.target;
        setValores((actuales) => ({ ...actuales, [name]: value }));
    }

    function manejarBlur(evento) {
        const { name } = evento.target;
        setTocados((actuales) => ({ ...actuales, [name]: true }));
    }

    // Devuelve el error visible de un campo (o null)
    function errorDe(campo) {
        return (intentoEnvio || tocados[campo]) && errores[campo] ? errores[campo] : null;
    }

    // id del elemento de un campo (para enlazar <label htmlFor>)
    function idDe(campo) {
        return `${prefijo}-${campo}`;
    }

    // Props comunes para un input/select/textarea de Bootstrap
    function propsCampo(campo, claseBase = "form-control") {
        const error = errorDe(campo);
        return {
            id: idDe(campo),
            className: `${claseBase}${error ? " is-invalid" : ""}`,
            name: campo,
            value: valores[campo],
            onChange: manejarCambio,
            onBlur: manejarBlur,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${idDe(campo)}-error` : undefined,
        };
    }

    // Envuelve el submit: si hay errores los muestra; si no, llama a onValido y reinicia
    function manejarSubmit(onValido) {
        return (evento) => {
            evento.preventDefault();
            setIntentoEnvio(true);
            if (!esValido) return;
            onValido(valores);
            setValores(valoresIniciales);
            setTocados({});
            setIntentoEnvio(false);
        };
    }

    return { idDe, errorDe, propsCampo, manejarSubmit, intentoEnvio, esValido };
}
