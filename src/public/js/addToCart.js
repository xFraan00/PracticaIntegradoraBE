

const socket = io();

    socket.on("productAddedToCart", (product) => {
        renderProduct(product);
    });

    function renderProduct(product) {
        const productTemplate = `
            <div>
                <h3>${product.title} (code: <span id="code">${product.code}</span>)</h3>
                <h4>Categoría: ${product.category}</h4>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
            </div>
        `;
        document.getElementById("cart").innerHTML += productTemplate;
    }

