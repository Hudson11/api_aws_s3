const User = require('../schemas/UserSchema')

class UserController{

    static createUser(req, res){
        const { name, password, email } = req.body
        const error = []
        if(!name || name === null)
            error.push({message: 'Name is required Field'})
        if(!password || password === null)
            error.push({message: 'Password is required Field'})
        if(!email || email === null)
            error.push({message: 'Email is required Field'})            
        
        if(error.length > 0)
            return res.status(200).json(error)
        
        User.create({
            email, name, password
        }).then((data) => {
            return res.status(200).json(data)
        }).catch((err) => {
            return res.status(200).json(data)
        })
    }

    static listUserById(req, res){
        const { id } = req.params
        if(id === null)
            return res.status(200).json({error: 'Id is not defined'})
        User.findById(id, (err, user) => {
            if(err)
                return res.status(200).json(err)
            return res.status(200).json(user)
        })
    }

}

module.exports = UserController