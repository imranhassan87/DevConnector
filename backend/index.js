const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const keys = require('./config/keys').mongooseURI



const app = express()

app.use(bodyParser.json())
// app.user(express.json({extended:false})) bodyPaser is now included in express

mongoose.connect(keys,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(result => {
        console.log("mongoDB connected!")
    })
    .catch(e => {
        console.log(e)
    })



app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/post'))
app.use('/api/profile', require('./routes/profile'))

const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})