const express = require("express");
const joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Favorites = require("../models/favorite")

const signUpSchema = joi.object({
    name: joi.string().required().min(2),
    email: joi.string().required().min(6).email(),
    password: joi.string().required().min(8),
    isBusiness: joi.boolean()
});

router.post("/", async (req, res) => {
    try {
        // joi
        const { error } = signUpSchema.validate(req.body);
        if (error) return res.status(400).send("Wrong body");

        // check if the user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already exists");

        // encrypt password and add to db
        user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();

        //create favorites cards
        let favorites = new Favorites({ userId: user._id, cards: [] })
        await favorites.save();

        // create token
        const token = jwt.sign(
            { _id: user._id, isBusiness: user.isBusiness },
            process.env.JWTKEY
        );
        res.status(201).send(token);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;