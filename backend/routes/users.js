const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const router = new express.Router

const User = require('../models/User')
const jwtKey = require('../config/keys').jwtSecret



router.post('/', [
    check('name', 'Name is requried').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'min characters 5 required').isLength({ min: 5 })
], async (req, res) => {

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        const { name, email, password } = req.body

        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ errors: [{ msg: 'User is already registered' }] })

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()


        const token = user.generateAuthToken()

        //res.header('x-auth-token', token).send(user)

        res.status(201).send({token})

    } catch (err) {
        res.status(500).send()
    }
})


router.get('/', (req, res) => {
    res.send("Okay this route is working")
})

module.exports = router