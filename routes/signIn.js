const express = require("express");
const joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const signInSchema = joi.object({
    email: joi.string().required().min(6).email(),
    password: joi.string().required().min(8),
});

router.post("/", async (req, res) => {
    try {
        // joi
        const { error } = signInSchema.validate(req.body);
        if (error) return res.status(400).send("Wrong body");

        // check if the user exists
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Wrong email or password");

        // check password
        const checkResult = await bcrypt.compare(req.body.password, user.password);
        if (!checkResult) return res.status(400).send("Wrong email or password");

        // create token
        const token = jwt.sign(
            { _id: user._id, isBusiness: user.isBusiness },
            process.env.JWTKEY
        );
        res.status(200).send(token);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;