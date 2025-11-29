// builtin modules
const express = require('express')
const cors = require('cors')

//userdefined modules
const authorizeUser = require('./utils/authuser')
const userRouter = require('./routes/user')
const foodRouter = require('./routes/food')
const orderRouter = require('./routes/order')

const app = express()

// Middlewares
app.use('/foodimage', express.static('foodimages')) // add the static route
app.use(cors()) // to allow the requests from different origin
app.use(express.json())
app.use(authorizeUser) // this is our middleware used for user authorization
app.use('/user', userRouter)
app.use('/food', foodRouter)
app.use('/order', orderRouter)

app.listen(4000, 'localhost', () => {
    console.log('Server started at port 4000')
})