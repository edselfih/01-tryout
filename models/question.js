const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema ({
    question: {
        type: String,
        required : true
    },
    key: {
        type: String,
        required : true
    },
    choice: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Question', questionSchema)