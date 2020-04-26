const jwt = require('jsonwebtoken')
const jwtKey = require('../config/keys').jwtSecret

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send("No Token, Access denied!")

    try {
        const decoded = jwt.verify(token, jwtKey)
        req.user = decoded
        next()
    } catch (err) {
        res.status(400).send("Invalid Token")
    }
}