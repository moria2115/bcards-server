const express = require("express");
const auth = require("../middlewares/auth");
const joi = require("joi");
const Favorites = require("../models/favorite");
const Card = require("../models/card")
const router = express.Router();


const cardSchema = joi.object({
    name: joi.string().required().min(2),
    phone: joi.number().required().min(8),
    address: joi.string().required().min(2),
    website: joi.string().required().min(2),
    description: joi.string().required().min(2),
    image: joi.string().required().min(2),
    userId: joi.string(),
    _id: joi.string(),
    __v: joi.number()
});

router.get("/", auth, async (req, res) => {
    try {
        let favorites = await Favorites.findOne({ userId: req.payload._id })
        if (!favorites) return res.status(404).send("No favorites cards for this user")
        res.status(200).send(favorites.cards)
    } catch (error) {
        res.status(400).send(error)

    }
})

router.post("/", auth, async (req, res) => {
    try {
        // joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error.message);

        //get favorites by userId
        let favorites = await Favorites.findOne({ userId: req.payload })
        if (!favorites) return res.status(404).send("No favorites cards for this user")
        //add cards to favorites

        if (favorites.cards.includes(req.body)) {
            res.status(400).send("Card already in favorites ")
            return
        } else {
            favorites.cards.push(req.body)
            await favorites.save();
            res.status(201).send("Card added to favorites successfully")
        }
    } catch (error) {
        res.status(400).send(error)
    }
});

router.get("/myCards", auth, async (req, res) => {
    try {
        //check if user biz
        if (!req.payload.isBusiness) return res.status(400).send("only bussiness users can see their own cards");
        //take all cards belongs to this user from db
        let cards = await Card.find({ user_id: req.payload._id });

        if (!cards) return res.status(404).send("No cards for this user")
        //return cards array
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;