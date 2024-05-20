import { Router } from "express";
import productModel from "../dao/models/products.model.js";

const productsRouter = Router();

productsRouter.get("/api/products", async (req, res) => {
    try {
        const products = await productModel.find();
        res.send({products});
    } catch (error) {
        console.log(error);
    }
});

productsRouter.get("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findOne({_id: productId});

        if (product) {
            res.send({product});
        } else {
            res.send({message: "El producto con el ID ingresado no existe"});
        };
    } catch (error) {
        console.log(error);
    }
});

productsRouter.post("/api/products", async (req, res) => {
    try {
        const {title, description, price, code, stock, category, thumbnail} = req.body;

        if(!title, !description, !price, !code, !stock, !category) {
            res.send({message: "Todos los campos son requeridos"})
        }
    
        const newProduct = await productModel.create({
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category,
            thumbnail: thumbnail
        });
        
        res.send({message: "Producto agregado con éxito", payload: newProduct});
    } catch (error) {
        console.log(error);
    }

});

productsRouter.put("/api/products/:pid", async (req, res ) => {
    try {
        const productId = req.params.pid;
        const productToReplace = req.body;
        await productModel.updateOne({_id: productId}, productToReplace);

        res.send({message: "Producto actualizado con éxito"});
    } catch (error) {
        console.log(error);
    }
});

productsRouter.delete("/api/products/:pid", async(req, res) => {
    const productId = req.params.pid;
    await productModel.deleteOne({_id: productId});
    res.send({message: "El producto se eliminó correctamente"});
});

export default productsRouter;