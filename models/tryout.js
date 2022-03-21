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
    section : [{
        type: Schema.Types.ObjectId,
        ref: 'Section'
    }],
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    display: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Tryout', tryoutSchema)



