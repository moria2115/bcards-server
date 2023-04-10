const mongoose = require("mongoose");

// schema
const favoritesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    cards: {
        type: Array,
        required: true,
    }
});

// model
const Favorites = mongoose.model("favorites", favoritesSchema);
module.exports = Favorites;