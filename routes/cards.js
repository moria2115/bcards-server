const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Card = require("../models/card")



router.get("/:cardId", auth, async (req, res) => {
    try {
        let card = await Card.findOne({ _id: req.params.cardId });
        if (!card) return res.status(404).send("No such card");
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.get("/", auth, async (req, res) => {
    try {
        let cards = await Card.find();
        res.status(200).send(cards)
    } catch (error) {
        res.status(400).send(error)
    }
})




module.exports = router;