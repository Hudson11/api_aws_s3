const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

router.post('/', AuthController.authenticated)

module.exports = router