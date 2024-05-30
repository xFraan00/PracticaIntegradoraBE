import chatModel from "../dao/models/chat.model.js";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";

const socketProducts = (socketServer) => {
    socketServer.on("connection", (socket) => {
        console.log("Cliente conectado");

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
                if (!userCartId) {
                    
                    const newCart = await cartModel.create({});

                    
                    userCartId = newCart._id;
                }

                
                await cartModel.findByIdAndUpdate(userCartId, { $addToSet: { products: { product: productId } } });

                console.log("Producto agregado al carrito con éxito");
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error);
            }
        });
    }); 
}; 
export default socketProducts;