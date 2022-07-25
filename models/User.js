const { Schema, model } = require('mongoose')


const User = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    address: { type: Number, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    roles: [{ type: String, ref: 'Role' }]
})

module.exports = model('User', User)