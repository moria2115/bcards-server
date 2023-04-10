const express = require("express");
const joi = require("joi");
const Card = require("../models/card");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/:userId", auth, async (req, res) => {
    try {
        let cards = await Card.find({ userId: req.payload.id });
        if (!cards) return res.status(404).send("No cards for this user")
        res.status(200).send(cards)
    } catch (error) {
        res.status(400).sendStatus(error)
    }
})