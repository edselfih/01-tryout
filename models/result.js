const mongoose = require('mongoose')
const Schema = mongoose.Schema


const resultSchema = new Schema ({
    tryout: {
        type: Schema.Types.ObjectId,
        unique : true,
        required: true,
        ref: 'Tryout'
    },
    questionMark: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'QuestionMark'
        }
    ],
    mark: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Result', resultSchema)