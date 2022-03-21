const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema ({
    question: String,
    key: {
        type: String,
        required : true
    },
    choice: [String],
    questionUrl: String,
    choiceUrl: [String],
    code: {
        type: String,
        unique: true,
        required: true
    }
})

module.exports = mongoose.model('Question', questionSchema)