import { Router } from "express";
import cartModel from "../dao/models/carts.model.js";

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        await cartModel.create({});
        res.send({ message: "Se creó el carrito correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Hubo un error al crear el carrito" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartContent = await cartModel.findOne({ _id: cartId }).populate("products.product");

        if (cartContent) {
            res.send({ cart: cartContent });
        } else {
            res.status(404).send({ message: "El carrito con el ID ingresado no existe" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Hubo un error al obtener el carrito" });
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        let cart = await cartModel.findOne({ _id: cartId });

        if (!cart) {
            return res.status(404).send({ message: "El carrito no existe" });
        }

        const existingProduct = cart.products.find(product => product.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        
        res.send({ message: "Producto agregado al carrito con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Hubo un error al agregar el producto al carrito" });
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartModel.findOne({ _id: cartId });

        const index = cart.products.findIndex((product) => product.id === productId);

        cart.products.splice(index, 1);

        await cart.save();
        res.send({ message: "Producto eliminado del carrito con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Hubo un error al eliminar el producto del carrito" });
    }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const cart = await cartModel.findOne({ _id: cartId });
        const product = cart.products.find((product) => product.id === productId);

        if (product) {
            product.quantity = quantity;
            await cart.save();
            res.send({ message: "Cantidad actualizada con éxito" });
        } else {
            res.status(404).send({ message: "El producto no está en el carrito" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Hubo un error al actualizar la cantidad del producto en el carrito" });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findOne({ _id: cartId });

        if (cart && cart.products.length > 0) {
            cart.products = [];
            await cart.save();
            res.send({ message: "Se vació el carrito exitosamente" });
        } else if (cart && cart.products.length === 0) {
            res.status(400).send({ message: "El carrito ya está vacío" });
        } else {
            res.status(404).send({ message: "El carrito con el ID ingresado no existe" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Hubo un error al vaciar el carrito" });
    }
});

export default cartsRouter;
