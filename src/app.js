const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const handlebars = require('express-handlebars')
// routers
const s3Router = require('./routers/s3Router');

class App {

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares(){
    this.app.use(cors())
    this.app.use(morgan('dev'))
    this.app.use(express.json())
  }

  routes(){
    this.app.use('/s3', s3Router)
  }
}

module.exports = new App().app