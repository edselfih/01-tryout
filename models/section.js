const mongoose = require('mongoose')
const Question = require('./question')
const Schema = mongoose.Schema

const sectionSchema = new Schema ({
    section: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    question: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]
})

sectionSchema.post('findOneAndDelete', async function (section) {
    if (section) {
        await Question.remove({
            _id: {
                $in: section.question
            }
        })
    }
})

module.exports = mongoose.model('Section', sectionSchema)