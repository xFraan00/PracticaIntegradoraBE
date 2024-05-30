import chatModel from "../dao/models/chat.model.js";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";

const socketProducts = (socketServer) => {
    socketServer.on("connection", (socket) => {
        console.log("Cliente conectado");

        // Variable para almacenar el ID del carrito del usuario
        let userCartId = null;

        socket.on("newProduct", async (data) => {
            data.price = parseInt(data.price);
            data.stock = parseInt(data.stock);

            await productModel.create(data);
        });

        socket.on("deleteProduct", async (productId) => {
            await productModel.deleteOne({_id: productId});
        });

        chatModel.find({}).sort({ createdAt: -1 }).limit(50)
            .then(dataDb => {
                socket.emit('messagesDB', dataDb);
            })
            .catch(error => {
                console.error("Error al consultar mensajes de chat:", error);
            });

        socket.on('message', async (data) => {
            await chatModel.create({user: data.userName, message: data.message});
        });

        socket.on("addToCart", async (productId) => {
            try {
                // Verificar si el usuario ya tiene un carrito
                if (!userCartId) {
                    // Si el usuario no tiene un carrito, crea uno nuevo en la base de datos
                    const newCart = await cartModel.create({ /* Coloca aquí cualquier información adicional que desees para el carrito */ });

                    // Almacena el ID del nuevo carrito
                    userCartId = newCart._id;
                }

                // Agrega el producto al carrito del usuario
                await cartModel.findByIdAndUpdate(userCartId, { $addToSet: { products: { product: productId } } });

                console.log("Producto agregado al carrito con éxito");
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error);
            }
        });
    }); // Cierra el socket.on("connection")
}; // Cierra el socketProducts

export default socketProducts;
