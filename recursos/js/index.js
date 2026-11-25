import productosDetailing from "./productos.js";
import renderizarProductos from "./funciones.js";

const CLAVE_CARRITO = "carrito";

const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorFiltros = document.getElementById("filtros");

// ---- filtro por Tipo ----
const TODOS = "Todos";
let tipoActivo = TODOS;

const tipoDe = (producto) => producto.Tipo ?? producto.tipo;

// Los tipos se arman solos a partir de productos.js, sin repetidos.
const tipos = [TODOS, ...new Set(productosDetailing.map(tipoDe).filter(Boolean))];

function mostrarProductos() {
    const lista = tipoActivo === TODOS
        ? productosDetailing
        : productosDetailing.filter(p => tipoDe(p) === tipoActivo);
    renderizarProductos(lista, contenedorProductos);
}

function marcarFiltroActivo() {
    contenedorFiltros.querySelectorAll(".btn-filtro").forEach(btn => {
        const activo = btn.dataset.tipo === tipoActivo;
        btn.classList.toggle("activo", activo);
        btn.setAttribute("aria-pressed", String(activo));
    });
}

function crearFiltros() {
    if (!contenedorFiltros) return;

    tipos.forEach(tipo => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-filtro";
        btn.dataset.tipo = tipo;
        btn.textContent = tipo;
        contenedorFiltros.append(btn);
    });

    contenedorFiltros.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-filtro");
        if (!btn) return;
        tipoActivo = btn.dataset.tipo;
        marcarFiltroActivo();
        mostrarProductos();
    });

    marcarFiltroActivo();
}

crearFiltros();
mostrarProductos();

// ---- carrito en localStorage ----
function leerCarrito() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

const contador = document.getElementById("contador");

function actualizarContador() {
    contador.textContent = leerCarrito().reduce((suma, p) => suma + p.cantidad, 0);
}

// Busca el producto en el array original a partir del botón clickeado.
// Requiere que el botón (o su tarjeta) tenga data-id con el id del producto.
// funciones.js usa el índice del array como data-id cuando el producto no tiene id.
function obtenerProducto(boton) {
    const id = boton.dataset.id ?? boton.closest("[data-id]")?.dataset.id;
    return productosDetailing.find((p, indice) => String(p.id ?? indice) === String(id));
}

// Convierte " $12.500" en 12500 (formato argentino: el punto es separador de miles).
function precioANumero(precio) {
    return Number(String(precio ?? "").replace(/\D/g, "")) || 0;
}

function agregarAlCarrito(producto) {
    const carrito = leerCarrito();
    // El nombre es único y no cambia si se reordena el catálogo, a diferencia del índice.
    const id = producto.id ?? producto.nombre;
    const existente = carrito.find(p => String(p.id) === String(id));

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id,
            nombre: producto.nombre,
            precio: precioANumero(producto.precio ?? producto.Precio),
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    actualizarContador();
}

actualizarContador();

// ---- botón Agregar ----
contenedorProductos.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-agregar");
    if (!boton) return;

    const producto = obtenerProducto(boton);
    if (!producto) {
        console.error("No se encontró el producto. Revisá que el botón tenga data-id.");
        return;
    }

    agregarAlCarrito(producto);

    boton.textContent = "¡Agregado!";
    boton.classList.add("agregado");
    setTimeout(() => {
        boton.textContent = "Agregar";
        boton.classList.remove("agregado");
    }, 900);
});

// ---- botón Carrito del header ----
document.getElementById("btn-carro")?.addEventListener("click", () => {
    window.location.href = "./carrito.html";
});