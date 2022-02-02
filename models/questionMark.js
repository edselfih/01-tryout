const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionMarkSchema = new Schema ({
    question: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    value: {
        type: Boolean,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('QuestionMark', questionMarkSchema)