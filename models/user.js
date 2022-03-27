const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')



const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    admin: Boolean,
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    result: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Result'
    }],
    tryout: [{
        type: Schema.Types.ObjectId,
        ref: 'Tryout'
    }],
    order: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]
})

userSchema.plugin(passportLocalMongoose)

module.exports= mongoose.model('User', userSchema)

