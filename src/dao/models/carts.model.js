import mongoose, { mongo } from "mongoose";

const cartCollection = "Carts";

const cartSchema = new mongoose.Schema({
    products: [
        {
            quantity: {type: Number, default: 0},
            default: []
        }
    ]
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;