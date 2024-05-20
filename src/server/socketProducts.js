import chatModel from "../dao/models/chat.model.js";
import productModel from "../dao/models/products.model.js";

const socketProducts = (socketServer) => {
    socketServer.on("connection", (socket) => {
        console.log("Cliente conectado");
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
    });
};

export default socketProducts;
