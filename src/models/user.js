import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: { type: String, unique: true },
    age: Number,
    password: {
        type: String,
        required: true
    },
    cartId: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],

    }
});

const firstCollection = mongoose.model(userCollection, userSchema);

export default firstCollection;
