import { Router } from "express";
import cartModel from "../dao/models/carts.model.js";

const cartsRouter = Router();

cartsRouter.post("/api/carts/", async (req, res) => {
    try {
        await cartModel.create({products: []});
        res.send({message: "Se creó el carrito correctamente"});
    } catch (error) {
        console.log(error);
    }
});

cartsRouter.get("/api/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartContent = await cartModel.findOne({_id: cartId});
    
        if (cartContent) {
            res.send({cartContent});
        } else {
            res.send({message: "El carrito con el ID ingresado no existe"});
        };
    } catch (error) {
        console.log(error);
    }
});

cartsRouter.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartModel.findOne({_id: cartId});

        if (cart) {
            const cartContent = cart.products;

            const productToCart = cartContent.some((product) => product === productId);

            if (!productToCart) {
                
                    const addToCart = await cartModel.create({_id: cartId, quantity: 1})

                    res.send({message: "Producto agregado al carrito correctamente", payload: addToCart});
                 
            };
        } else {
            console.log("El carrito no existe");
        };
    } catch (error) {
        console.log(error);
    };
});

export default cartsRouter;