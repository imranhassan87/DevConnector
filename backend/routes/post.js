const express = require('express')
const router = new express.Router
const { check, validationResult } = require('express-validator')

const Post = require('../models/Post')
const User = require('../models/User')
const auth = require('../middlewhere/auth')


//create a post
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
        const user = await User.findById(req.user._id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user._id
        })

        const post = await newPost.save()

        res.status(201).json(post)

    } catch (err) {
        res.status(500).send()
    }
})


//get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }) // -1 means it gives us most recent first
        res.send(posts)
    } catch (err) {
        res.status(500).send()
    }
})


//get post by id
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).send("No post found.")
        res.send(post)
    } catch (error) {
        if (error.kind === "ObjectId") return res.status(404).send("No post found.")
        res.status(500).send()
    }
})

//delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(400).send("No post found")

        //checking its the same user that owns the post
        if (post.user.toString() !== req.user._id) return res.status(401).send("Not authorized")

        await post.remove()

        res.send("Post successfully removed!")
    } catch (error) {
        if (error.kind === "ObjectId") return res.status(404).send("No post found.")
        res.status(400).send("Post not found!")
    }
})

//adding likes.. if someone clicks post gets liked
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).send("Sorry no post found!")

        //check if the post has already been liked by this user
        if (post.likes.filter(like => like.user.toString() === req.user._id).length > 0) {
            return res.status(400).json({ msg: "Already liked" })
        }
        post.likes.unshift({ user: req.user._id })

        //after liked we're gonna have to save it to the database
        await post.save()

        res.json(post.likes)
    } catch (error) {
        res.status(500).send()
    }
})

//unliking the post

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).send("Sorry no post found")

        //check if the post has already been unliked
        if (post.likes.filter(like => like.user.toString() === req.user._id).length === 0) {
            return res.status(400).json({ msg: "Already unliked!" })
        }
        //get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user._id)
        post.likes.splice(removeIndex, 1)

        await post.save()
        res.json(post.likes)
    } catch (error) {

    }
})


//adding comment by the user

router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.json({ errors: errors.array() })

    try {
        const user = await User.findById(req.user._id).select('-password')
        const post = await Post.findById(req.params.id)

        if (!post) return res.status(404).send("No post found.")

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user._id
        }
        post.comments.push(newComment)
        await post.save()
        res.send(post.comments)
    } catch (error) {
        res.status(500).send()
    }
})


//removing comment of the user
//post id and comment id needed
router.delete('/delete/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //pull out comment form the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        //first make sure the comment exists
        if (!comment) return res.status(404).send("comment doesn't exist")

        if (comment.user.toString() !== req.user._id) return res.status(400).send("not authorized!")

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user._id)
        post.comments.splice(removeIndex, 1)
        await post.save()
        res.status(200).send(post.comments)
    } catch (error) {
        res.status(500).send("Sever Error!")
    }
})



module.exports = router