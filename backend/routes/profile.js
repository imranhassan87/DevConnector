const express = require('express')
const router = new express.Router
const { check, validationResult } = require('express-validator')
const request = require('request')

const githubClientId = require('../config/keys').githubClientId
const githubClientSecret = require('../config/keys').githubClientSecret
const auth = require('../middlewhere/auth')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Post = require('../models/Post')


//getting our profile or u can say getting current user profile
//its is a protected router so we're gonna add the middlewhere(auth)
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).populate('user', ['name', 'avatar'])
        if (!profile) return res.status(400).send("There is no profile for this user!")

        res.json(profile)
    } catch (err) {
        res.status(500).send("Server Error!")
    }
})


//creating or updating a profile
router.post('/', [auth, [
    check('status', "Status is required").not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { company,
        website,
        location,
        bio, status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        linkedin,
        instagram,
    } = req.body

    //build profile object
    const profileFields = {}
    profileFields.user = req.user._id

    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername

    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    //build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (twitter) profileFields.social.twitter = twitter
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram


    try {

        let profile = await Profile.findOne({ user: req.user._id })

        //if profile was found so update it
        if (profile) {
            profile = await Profile
                .findOneAndUpdate(
                    { user: req.user._id },
                    { $set: profileFields },
                    { new: true }
                )
            return res.json(profile)
        }

        //creating profile
        profile = new Profile(profileFields)

        await profile.save()

        res.json(profile)


    } catch (err) {
        res.status(500).send("Server Error")
    }
})


//getting all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.status(200).json(profiles)
    } catch (err) {
        res.status(500).send()
    }
})

//getting profile by id
router.get('/user/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'avatar'])
        if (!profile) return res.status(404).send("Profile not found!")
        res.status(200).send(profile)
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).send("Profile not found!")
        res.status(500).send('server error')
    }
})


//deleting the profile and the user
router.delete('/delete', auth, async (req, res) => {
    try {
        //remove user's posts
        await Post.deleteMany({user:req.user._id})
        //remove profile
        const profile = await Profile.findOneAndRemove({ user: req.user._id }) //this is private thats why not using the params.id cause it has the token
        if (!profile) return res.status(400).send("Profile not found!")

        //remove user
        const user = await User.findOneAndRemove({ _id: req.user._id })
        if (!user) return res.status(400).send("User not found!")

        res.send("User is removed!")

    } catch (err) {
        res.status(404).send("Sorry the Profile not found!")
    }
})

//adding experiance

router.put('/experiance', [auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() })

    const { title, company, location, from, to, current, description } = req.body
    const newExp = { title, company, location, from, to, current, description }

    try {
        const profile = await Profile.findOne({ user: req.user._id })
        profile.experiance.unshift(newExp)

        await profile.save()

        res.status(201).send(profile)

    } catch (err) {
        res.status(400).send()
    }
})


//delete profile experiance
router.delete('/experiance/:exp_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user._id })
        if (!profile) return res.status(400).send("sorry profile not found")

        //get remove index
        const removeIndex = profile.experiance.map(item => item.id).indexOf(req.params.exp_id)
        profile.experiance.splice(removeIndex, 1)

        await profile.save()
        res.send(profile)
    } catch (err) {
        res.status(404).send('No experiance found!')
    }
})


//adding education

router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() })

    const { school, degree, fieldofstudy, from, to, current, description } = req.body
    const newEdu = { school, degree, fieldofstudy, from, to, current, description }

    try {
        const profile = await Profile.findOne({ user: req.user._id })
        profile.education.unshift(newEdu)

        await profile.save()

        res.status(201).send(profile)

    } catch (err) {
        res.status(400).send()
    }
})


//delete profile education
router.delete('/education/:edu_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user._id })
        if (!profile) return res.status(400).send("sorry profile not found")

        //get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1)

        await profile.save()
        res.send(profile)
    } catch (err) {
        res.status(404).send('No education found!')
    }
})

//get the github profile
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error)

            if (response.statusCode !== 200) return res.status(404).send("No github profile found!")

            res.json(JSON.parse(body))
        })

    } catch (err) {
        res.status(404).send()
    }
})

module.exports = router