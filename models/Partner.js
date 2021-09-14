const {
    Schema,
    model
} = require('mongoose')

const partnerSchema = new Schema({
    partner: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }

})

module.exports = model('partner', partnerSchema)