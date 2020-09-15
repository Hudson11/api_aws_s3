const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
// routers
const s3Router = require('./routers/s3Router')
const userRouter = require('./routers/userRouter')
const authRouter = require('./routers/authRouter')

class App {

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
    this.database()
  }

  middlewares(){
    this.app.use(cors())
    this.app.use(morgan('dev'))
    this.app.use(express.json())
  }

  routes(){
    this.app.use('/s3', s3Router)
    this.app.use('/user', userRouter)
    this.app.use('/auth', authRouter)
  }

  database(){
    mongoose.connect(process.env.URLDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },(err) => {
      if(err)
        console.log(err)
      console.log('Conectado ao MongoDB')
    })
  }
}

module.exports = new App().app