const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const joi = require("joi");
const Card = require("../models/card")
const cardSchema = joi.object({
    name: joi.string().required().min(2),
    phone: joi.string().required().min(8),
    address: joi.string().required().min(5),
    website: joi.string().required().min(5),
    description: joi.string().required().min(5),
    image: joi.string().required().min(5),
    userId: joi.string(),
    _id: joi.string()
});

router.delete("/:cardId", auth, async (req, res) => {
    try {
        // check if user is Business
        if (!req.payload.isBusiness)
            return res.status(400).send("Access denied. No business permission");

        // find the product and remove it
        let card = await Card.findOneAndRemove({ _id: req.params.cardId });
        if (!card) return res.status(404).send("No such card");
        res.status(200).send("Card removed successfully");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put("/:cardId", auth, async (req, res) => {
    try {
        // check if user is business
        if (!req.payload.isBusiness)
            return res.status(400).send("Access denied. No business permission");

        // joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send("Wrong body");

        // find the card and update it
        let card = await Card.findOneAndUpdate(
            { _id: req.params.cardId },
            req.body,
            { new: true }
        );

        if (!card) return res.status(404).send("No such card");
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        // check if user is business
        if (!req.payload.isBusiness)
            return res.status(400).send("Access denied. No Business permission");

        // joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send("Wrong body");

        // create new card and save in db
        console.log(req.body);
        let card = new Card({ ...req.body, userId: req.payload._id });
        await card.save();
        console.log(card);
        res.status(201).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.get("/", auth, async (req, res) => {
    try {
        //check if user isBusiness
        if (!req.payload.isBusiness)
            return res
                .status(400)
                .send("only bussiness users can see their own cards");
        //take all cards belongs to this user from db
        let cards = await Card.find({ userId: req.payload._id });
        if (!cards) return res.status(404).send("this user has no cards");
        //return cards array
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
module.exports = router;