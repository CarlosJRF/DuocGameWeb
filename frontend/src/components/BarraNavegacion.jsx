import { useState } from "react";
import logo from "../assets/imagenes/logo.jpg";

/**
 * Barra de navegación con enlaces a las secciones, buscador y botón del carrito
 * con contador de productos.
 *
 * Props:
 * - cantidadCarrito: número total de unidades en el carrito (insignia)
 * - onBuscar(texto): aplica el texto de búsqueda al catálogo
 */
export default function BarraNavegacion({ cantidadCarrito, onBuscar }) {
    // Estado controlado del campo de búsqueda
    const [textoBusqueda, setTextoBusqueda] = useState("");

    function manejarSubmit(evento) {
        evento.preventDefault();
        onBuscar(textoBusqueda);
    }

    return (
        <nav className="navbar navbar-expand-lg sticky-top barra-navegacion" aria-label="Navegación principal">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center gap-2" href="#inicio">
                    <img src={logo} alt="Logotipo de DuocGameWeb" width="64" height="35" className="rounded" />
                    DuocGameWeb
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarPrincipal"
                    aria-controls="navbarPrincipal" aria-expanded="false" aria-label="Abrir menú de navegación">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarPrincipal">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><a className="nav-link" href="#inicio">Inicio</a></li>
                        <li className="nav-item"><a className="nav-link" href="#catalogo">Catálogo</a></li>
                        <li className="nav-item"><a className="nav-link" href="#administrar">Publicar juego</a></li>
                        <li className="nav-item"><a className="nav-link" href="#contacto">Contacto</a></li>
                    </ul>

                    <form className="d-flex me-lg-2 mb-2 mb-lg-0" role="search" onSubmit={manejarSubmit}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Buscar un videojuego..."
                            aria-label="Buscar"
                            value={textoBusqueda}
                            onChange={(evento) => setTextoBusqueda(evento.target.value)}
                        />
                        <button className="btn btn-outline-warning" type="submit">Buscar</button>
                    </form>

                    <button className="btn btn-warning position-relative" type="button"
                        data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrito" aria-controls="offcanvasCarrito">
                        🛒 Carrito
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cantidadCarrito}
                            <span className="visually-hidden"> productos en el carrito</span>
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
