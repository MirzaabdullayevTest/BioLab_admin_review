const {
    Schema,
    model
} = require('mongoose')

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

module.exports = model('Category', categorySchema)