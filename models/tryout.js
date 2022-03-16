const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tryoutSchema = new Schema ({
    title: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    image:  String,
    price: Number,
    // harus dikasih array biar bisa dipush
    question : [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Tryout', tryoutSchema)



