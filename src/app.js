import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import socketProducts from "./server/socketProducts.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/session.router.js";
import __dirname from "./utils.js";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars"

dotenv.config();
console.log(process.env.MONGO_URL);
const app = express();
const PORT = 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}));

app.use((req, res, next) => {
    res.locals.isLogUser = req.session.user ? true : false;
    res.locals.isAdmin = req.session.user?.role == 'admin' ? true : false;
    res.locals.user = req.session.user ? req.session.user : undefined;
    next();
});

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/session', sessionsRouter);
app.use(express.static(__dirname + '/Public'));

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Connected to the database"); })
    .catch(error => console.error("Error connecting to the database", error));

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const socketServer = new Server(httpServer);

socketProducts(socketServer);
