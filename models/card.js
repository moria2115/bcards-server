const mongoose = require("mongoose");

// schema
const cardSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    name: {
        type: String,
        minlength: 2,
    },
    description: {
        type: String,
        minlength: 5,
        required: true
    },
    address: {
        type: String,
        minlength: 5,
        required: true
    },
    phone: {
        type: String,
        minlength: 8,
        required: true
    },
    website: {
        type: String,
        minlength: 5,
        required: true
    },
    image: {
        type: String,
        minlength: 5,
        required: true
    }
});

// model
const Card = mongoose.model("cards", cardSchema);
module.exports = Card;