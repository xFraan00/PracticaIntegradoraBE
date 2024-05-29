import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";


const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
    try {
        const products = await productModel.find().lean();
        res.render("home", { products });
    } catch (error) {
        console.log(error);
    }
});

viewsRouter.get("/realtimeproducts", (_req, res) => {
    res.render("realTimeProducts", {});
});

viewsRouter.get('/chat', async (_req, res) => { 
    res.render('chat', {});
});

viewsRouter.get("/products", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 5;
        const options = {
            page,
            limit,
            lean: true
        };
        const products = await productModel.paginate({}, options);
        const { prevPage, nextPage, hasPrevPage, hasNextPage } = products;
        
        const prevLink = hasPrevPage ? `/products?page=${prevPage}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}` : null;
        
        res.render("products", { products, prevLink, nextLink, page });
    } catch (error) {
        console.log(error);
    }
});

viewsRouter.get("/carts", async (req, res) => {
    try {
        // Buscar el último carrito creado en la base de datos
        const cart = await cartsModel.findOne().sort({ createdAt: -1 }).populate("products.product");

        if (cart) {
            // Si se encontró un carrito, renderizar la vista del carrito con el carrito encontrado
            res.render("cart", { cart });
        } else {
            // Si no se encontró ningún carrito, renderizar la vista del carrito con un mensaje de error
            res.render("cart", { message: "No se encontró ningún carrito" });
        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la búsqueda del carrito
        console.log(error);
        res.render("cart", { message: "Hubo un error al cargar el carrito" });
    }
});


export default viewsRouter;
