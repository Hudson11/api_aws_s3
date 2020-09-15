const jsonwebtoken = require('jsonwebtoken')
const User = require('../schemas/UserSchema')
require('dotenv').config()

class AuthController {

    static async authenticated(req, res)  {
        const { email, password } = req.body
        const erros = []

        if (!email || email === null) {
            erros.push({ message: 'Email field is required' })
        }
        if (!password || email === password) {
            erros.push({ message: 'Password field is required' })
        }

        if (erros.length > 0) {
            return res.json({ status: false, errors: erros })
        }

        await User.findOne({ email: email }, (err, doc) => {
            if (err) {
                return res.json({ status: false, error: err })
            }
            if (doc) {
                if(doc.password == password){
                    const token = jsonwebtoken.sign({ id: doc._id }, process.env.JWT_SECRET, { expiresIn: 86400 })
                    return res.json({ status: true, message: 'Authenticaded', token: token })
                }
                return res.json({ status: false, message: 'Password error'})
            }
            res.json({ status: false, message: 'Unauthorized' })
        })
    }

    static async tokenVerify(req, res, next){
        const { authorization } = req.headers
        
        if(!authorization)
            return res.status(401).json({message: 'No token provided'})
        
        const parts = authorization.split(' ')

        if(parts.length !== 2)
            return res.status(401).json({message: 'Token error'})
        
        const [ scheme, token ] = parts

        if (!/^Bearer$/.test(scheme)) {
            return res.status(401).json({message: 'Token malformatted' })
        }

        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err) => {
            if(err)
                return res.status(401).json({message: 'Token invalid', error: err})
            return next()
        })
    }
}

module.exports = AuthController