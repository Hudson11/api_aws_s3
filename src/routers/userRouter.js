const router = require('express').Router()
const UserController = require('../controllers/UserController')
const authController = require('../controllers/AuthController')
const AuthController = require('../controllers/AuthController')

router.post('/', UserController.createUser)
router.get('/:id', AuthController.tokenVerify, UserController.listUserById)

module.exports = router