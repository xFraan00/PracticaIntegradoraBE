import mongoose from "mongoose";

const ChatCollection = 'Chat';
const ChatSchema = new mongoose.Schema({
    user: {type: String, required: true},
    message: {type: String, required: true}
})

const chatModel = mongoose.model(ChatCollection, ChatSchema);

export default chatModel;