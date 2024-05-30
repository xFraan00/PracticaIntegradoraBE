import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import socketProducts from "./server/socketProducts.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js"; 
import dotenv from "dotenv";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import __dirname from "./utils.js"


dotenv.config();
console.log(process.env.MONGO_URL);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const mongoStoreOptions = {
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions'
};
const sessionMiddleware = session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions)
});
app.use(sessionMiddleware);

const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use((req, res, next) => {
    res.locals.isLogUser = req.session.user ? true : false;
    res.locals.isAdmin = req.session.user?.role == 'admin' ? true : false;
    res.locals.user = req.session.user ? req.session.user : undefined;
    next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use('/api/session', sessionRouter); // Monta las rutas de sesión aquí

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexión", error));

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const socketServer = new Server(httpServer);
socketProducts(socketServer);
