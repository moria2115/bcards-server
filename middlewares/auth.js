const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        let token = req.header("Authorization")
        if (!token) return res.status(401).send("Access denied. No token provided")

        let payload = jwt.verify(token, process.env.JWTKEY);
        req.payload = payload;
        next();
    } catch (error) {
        res.status(401).send(error)
    }
}