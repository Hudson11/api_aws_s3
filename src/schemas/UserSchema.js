const mongoose = require('mongoose')
const model = mongoose.model
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    }
}, { timestamps: true })

module.exports = model('user', userSchema)