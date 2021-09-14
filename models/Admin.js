const {
    Schema,
    model
} = require('mongoose')

const adminSchema = new Schema({
    login: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        unique: true
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    avatar:{
        type: String
    }
})

module.exports = model('Admin', adminSchema)