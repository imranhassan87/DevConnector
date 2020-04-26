const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const jwtKey = require('../config/keys').jwtSecret

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    avatar: {
        type: String
    }
}, { timestamps: true })

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, jwtKey, { expiresIn: 360000 })
    return token
}

const User = mongoose.model("User", userSchema)

module.exports = User