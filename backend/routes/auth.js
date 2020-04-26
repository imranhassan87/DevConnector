const express = require('express')
const router = new express.Router
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

const auth = require('../middlewhere/auth')
const User = require('../models/User')

//redirect uri for github http://localhost:6000/auth/callback

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.send(user)
    } catch (err) {
        res.stat(500).send("Server Error")
    }
})


router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid login or password!' }] })

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return res.status(400).json({ errors: [{ msg: 'Invalid login or password!' }] })

        const token = user.generateAuthToken()

        res.send({token})

    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router