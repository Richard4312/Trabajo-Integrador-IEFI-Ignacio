function renderizarProductos(productos, contenedor) {
    let productosHTML = '';
    productos.forEach((producto, indice) => {
        productosHTML += ` 
            <article>
                <h3>
                <a href="${producto.link}">
                   ${producto.nombre}
                   </a>
                </h3>
                <picture>
                <a href="${producto.link}">                    
                    <img src="${producto.imagen}" alt="${producto.nombre}">    
                    </a>                 
                </picture>
                <p>
                 ${producto.descripcion || producto.Descripcion}
                </p>
                <ul>
                    <li>Presentación: ${producto.Tamaño || producto.tamaño}</li>
                    <li>Precio: ${producto.precio || producto.Precio}</li>
                    <li>Tipo: ${producto.Tipo || producto.tipo}</li>
                </ul>
                <button type="button" class="btn-agregar" data-id="${producto.id ?? indice}">
                    Agregar
                </button>
            </article>`;
    });

    contenedor.innerHTML = productosHTML;
}

export default renderizarProductos;