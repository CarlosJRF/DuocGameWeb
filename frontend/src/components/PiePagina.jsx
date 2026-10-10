/**
 * Pie de página con datos de contacto y redes sociales. No recibe props.
 */
export default function PiePagina() {
    return (
        <footer className="pie-pagina py-4 mt-auto">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-center text-md-start">
                <address className="mb-0">
                    <p className="mb-1"><strong>Dirección:</strong> Av. Siempre Viva 123, Región Metropolitana</p>
                    <p className="mb-0"><strong>Email:</strong> contacto@duocgameweb.cl</p>
                </address>

                <div className="text-md-end">
                    <p className="mb-1">Síguenos en nuestras redes:</p>
                    <ul className="list-inline mb-0">
                        <li className="list-inline-item"><a href="#">GitHub</a></li>
                        <li className="list-inline-item"><a href="#">Discord</a></li>
                        <li className="list-inline-item"><a href="#">Instagram</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
