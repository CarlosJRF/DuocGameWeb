import { useState, useEffect, useRef, useCallback } from "react";
import BarraNavegacion from "./components/BarraNavegacion.jsx";
import Carrito from "./components/Carrito.jsx";
import FiltroCategorias from "./components/FiltroCategorias.jsx";
import ListaVideojuegos from "./components/ListaVideojuegos.jsx";
import FormularioVideojuego from "./components/FormularioVideojuego.jsx";
import FormularioContacto from "./components/FormularioContacto.jsx";
import Notificaciones from "./components/Notificaciones.jsx";
import PiePagina from "./components/PiePagina.jsx";

// En local consulta la API Express; en GitHub Pages se define VITE_URL_API al compilar
const URL_API_VIDEOJUEGOS = import.meta.env.VITE_URL_API ?? "http://localhost:3000/api/videojuegos";
const CLAVE_CARRITO = "duocGameWeb.carrito";

/**
 * Componente raíz: mantiene el estado del catálogo, los filtros, el carrito y
 * los avisos, y lo reparte a los componentes hijos mediante props. No recibe props.
 */
export default function App() {
    const [videojuegos, setVideojuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    // Categoría del filtro; "" = todas
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    // Items del carrito: { id, nombre, precio, cantidad }
    const [carrito, setCarrito] = useState([]);
    // Evita guardar el carrito vacío inicial antes de haber leído localStorage
    const [carritoRestaurado, setCarritoRestaurado] = useState(false);
    // Avisos (Toast) visibles: { id, titulo, mensaje, tipo }
    const [notificaciones, setNotificaciones] = useState([]);
    const siguienteIdNotificacion = useRef(1);

    // ===== Catálogo (API) =====

    function cargarVideojuegos() {
        setLoading(true);
        setError(null);

        fetch(URL_API_VIDEOJUEGOS)
            .then((respuesta) => {
                if (!respuesta.ok) {
                    throw new Error(`Respuesta HTTP ${respuesta.status}`);
                }
                return respuesta.json();
            })
            .then((datos) => setVideojuegos(datos))
            .catch((err) => {
                console.error("Error al cargar el catálogo:", err);
                setError("No pudimos cargar el catálogo de videojuegos. Revisa tu conexión e inténtalo de nuevo.");
            })
            .finally(() => setLoading(false));
    }

    // Consulta el catálogo una sola vez, al montar
    useEffect(() => {
        cargarVideojuegos();
    }, []);

    // ===== Persistencia del carrito =====

    // Al montar: recupera el carrito guardado (si existe)
    useEffect(() => {
        try {
            const guardado = localStorage.getItem(CLAVE_CARRITO);
            if (guardado) {
                setCarrito(JSON.parse(guardado));
            }
        } catch (err) {
            console.error("No se pudo leer el carrito guardado:", err);
        }
        setCarritoRestaurado(true);
    }, []);

    // Cada vez que cambia el carrito: lo guarda para sobrevivir a recargas
    useEffect(() => {
        if (!carritoRestaurado) return;
        try {
            localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
        } catch (err) {
            console.error("No se pudo guardar el carrito:", err);
        }
    }, [carrito, carritoRestaurado]);

    // ===== Notificaciones =====

    function notificar(titulo, mensaje, tipo) {
        const id = siguienteIdNotificacion.current++;
        setNotificaciones((actuales) => [...actuales, { id, titulo, mensaje, tipo }]);
    }

    // Estable entre renders para no reiniciar el temporizador de cada Toast
    const cerrarNotificacion = useCallback((id) => {
        setNotificaciones((actuales) => actuales.filter((n) => n.id !== id));
    }, []);

    function avisarEliminado(nombre) {
        notificar("Producto eliminado con éxito", `«${nombre}» se quitó del carrito.`, "info");
    }

    // ===== Acciones del carrito =====

    // Suma una unidad; si el videojuego no estaba, lo agrega
    function agregarAlCarrito(videojuego) {
        if (!carrito.some((item) => item.id === videojuego.id)) {
            notificar("Producto agregado con éxito", `«${videojuego.nombre}» está en tu carrito.`, "exito");
        }
        setCarrito((actual) => {
            const existente = actual.find((item) => item.id === videojuego.id);
            if (existente) {
                return actual.map((item) =>
                    item.id === videojuego.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [
                ...actual,
                { id: videojuego.id, nombre: videojuego.nombre, precio: videojuego.precio, cantidad: 1 },
            ];
        });
    }

    // Resta una unidad; si llega a cero, el videojuego sale del carrito
    function restarDelCarrito(id) {
        const item = carrito.find((i) => i.id === id);
        if (item?.cantidad === 1) {
            avisarEliminado(item.nombre);
        }
        setCarrito((actual) =>
            actual
                .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item))
                .filter((item) => item.cantidad > 0)
        );
    }

    function eliminarDelCarrito(id) {
        const item = carrito.find((i) => i.id === id);
        if (item) {
            avisarEliminado(item.nombre);
        }
        setCarrito((actual) => actual.filter((item) => item.id !== id));
    }

    function vaciarCarrito() {
        notificar("Carrito vaciado", "Se quitaron todos los productos del carrito.", "info");
        setCarrito([]);
    }

    // ===== Gestión del catálogo =====

    // Agrega al inicio del catálogo un videojuego creado desde el formulario
    function publicarVideojuego(datos) {
        setVideojuegos((actuales) => [{ id: crypto.randomUUID(), ...datos }, ...actuales]);
        // Se quita el filtro para que el nuevo videojuego quede a la vista
        setCategoriaSeleccionada("");
        notificar("Videojuego publicado", `«${datos.nombre}» ya aparece en el catálogo.`, "exito");
    }

    // Quita un videojuego del catálogo (y del carrito, si estaba)
    function eliminarDelCatalogo(videojuego) {
        setVideojuegos((actuales) => actuales.filter((v) => v.id !== videojuego.id));
        setCarrito((actual) => actual.filter((item) => item.id !== videojuego.id));
        notificar("Videojuego quitado del catálogo", `«${videojuego.nombre}» ya no aparece en la tienda.`, "info");
    }

    // ===== Contacto =====

    // Sin servidor de correo: se confirma al usuario y se registra en consola
    function enviarContacto({ nombre, email, mensaje }) {
        console.info("Mensaje de contacto:", { nombre, email, mensaje });
        notificar("Mensaje enviado con éxito", `Gracias, ${nombre}. Te responderemos a ${email}.`, "exito");
    }

    // ===== Valores derivados =====

    const cantidadTotal = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
    const total = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);

    const termino = busqueda.trim().toLowerCase();
    const coincidenBusqueda = termino === ""
        ? videojuegos
        : videojuegos.filter((v) =>
            v.nombre.toLowerCase().includes(termino) ||
            v.descripcion.toLowerCase().includes(termino)
        );

    const conteoPorCategoria = coincidenBusqueda.reduce(
        (conteo, v) => ({ ...conteo, [v.categoria]: (conteo[v.categoria] ?? 0) + 1 }),
        { total: coincidenBusqueda.length }
    );

    const videojuegosFiltrados = categoriaSeleccionada === ""
        ? coincidenBusqueda
        : coincidenBusqueda.filter((v) => v.categoria === categoriaSeleccionada);

    return (
        <>
            <BarraNavegacion cantidadCarrito={cantidadTotal} onBuscar={setBusqueda} />

            <Carrito
                carrito={carrito}
                total={total}
                onAgregar={agregarAlCarrito}
                onRestar={restarDelCarrito}
                onEliminar={eliminarDelCarrito}
                onVaciar={vaciarCarrito}
            />

            <header id="inicio" className="encabezado text-center py-5">
                <div className="container">
                    <h1 className="display-4 fw-bold">DuocGameWeb</h1>
                    <p className="lead mb-1">Bienvenidos a la tienda de videojuegos OpenSource creados por estudiantes.</p>
                    <p className="mb-4">Ayúdanos a mejorar divirtiéndote y dándonos feedback.</p>
                    <a href="#catalogo" className="btn btn-warning btn-lg">Ver videojuegos</a>
                </div>
            </header>

            <main className="container my-5">
                <section id="catalogo" className="seccion mb-5" aria-labelledby="titulo-catalogo">
                    <h2 id="titulo-catalogo" className="mb-3">Catálogo de videojuegos</h2>
                    {!loading && !error && (
                        <FiltroCategorias
                            categoriaSeleccionada={categoriaSeleccionada}
                            conteo={conteoPorCategoria}
                            onSeleccionar={setCategoriaSeleccionada}
                        />
                    )}
                    <ListaVideojuegos
                        videojuegos={videojuegosFiltrados}
                        loading={loading}
                        error={error}
                        carrito={carrito}
                        onAgregar={agregarAlCarrito}
                        onEliminar={eliminarDelCatalogo}
                        onReintentar={cargarVideojuegos}
                    />
                </section>

                <div className="row g-5">
                    <section id="administrar" className="col-lg-7" aria-labelledby="titulo-administrar">
                        <div className="seccion h-100">
                            <h2 id="titulo-administrar" className="mb-1">Publica tu videojuego</h2>
                            <p className="text-body-secondary">¿Creaste un juego? Súmalo al catálogo de la tienda.</p>
                            <FormularioVideojuego onPublicar={publicarVideojuego} />
                        </div>
                    </section>

                    <section id="contacto" className="col-lg-5" aria-labelledby="titulo-contacto">
                        <div className="seccion h-100">
                            <h2 id="titulo-contacto" className="mb-1">Contacto</h2>
                            <p className="text-body-secondary">Escríbele al administrador del sitio.</p>
                            <FormularioContacto onEnviar={enviarContacto} />
                        </div>
                    </section>
                </div>
            </main>

            <PiePagina />

            <Notificaciones notificaciones={notificaciones} onCerrar={cerrarNotificacion} />
        </>
    );
}
