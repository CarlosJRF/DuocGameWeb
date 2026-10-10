/**
 * Mensaje de error bajo un campo de formulario (estilo "invalid-feedback" de Bootstrap).
 *
 * Props:
 * - id: id del campo (el mensaje usa `${id}-error`, enlazado con aria-describedby)
 * - error: texto del error, o null para no mostrar nada
 */
export default function ErrorCampo({ id, error }) {
    if (!error) return null;
    return (
        <div id={`${id}-error`} className="invalid-feedback">
            {error}
        </div>
    );
}
