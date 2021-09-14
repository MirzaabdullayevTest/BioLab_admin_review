const {
    Schema,
    model
} = require('mongoose')

const blogSchema = new Schema({
    img: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    data: {
        type: Date,
        default: Date.now
    },

})

module.exports = model('blog', blogSchema)