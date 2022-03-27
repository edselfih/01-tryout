const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema ({
    orderNum : {
        type: Number,
        required: true
    },
    tryout: {
        type: Schema.Types.ObjectId,
        ref: 'Tryout'
    }
})

module.exports = mongoose.model('Order', orderSchema)