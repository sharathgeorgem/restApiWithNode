const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

mongoose.connect(
  'mongodb://sgmlogsn:' +
  process.env.MONGO_ATLAS_PW +
  '@node-shop-shard-00-00-ba5p9.mongodb.net:27017,node-shop-shard-00-01-ba5p9.mongodb.net:27017,node-shop-shard-00-02-ba5p9.mongodb.net:27017/test?ssl=true&replicaSet=node-shop-shard-0&authSource=admin&retryWrites=true',
  {useNewUrlParser: true}
)

// middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// To ensure that CORS errors are prevented
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found bruh')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
