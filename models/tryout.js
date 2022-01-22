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
})

module.exports = mongoose.model('Tryout', tryoutSchema)


