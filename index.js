const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
const signin = require("./routes/signIn")
const signup = require("./routes/signUp")
const cards = require("./routes/cards")
const profile = require("./routes/profile")
const favorites = require("./routes/favorites")
const myCards = require("./routes/myCards")


const port = process.env.PORT || 6000;

const logger = (req, res, next) => {
    console.log(`${req.method}, ${req.url}`);
    next()
}

app.use(express.json());
app.use(cors());
app.use(logger);

app.use("/api/signin", signin)
app.use("/api/signup", signup)
app.use("/api/cards", cards)
app.use("/api/profile", profile)
app.use("/api/favorites", favorites)
app.use("/api/myCards", myCards)


mongoose.connect(process.env.DB, { useNewUrlParser: true }).then(() => console.log("Mongodb connected")).catch(() => "Cannot connect to Mongodb");
app.listen(port, () => console.log(`Server started on port ${port}`))