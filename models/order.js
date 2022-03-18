const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema ({
    order: [{
        type: Number,
        required : true
    }],
})

module.exports = mongoose.model('Order', orderSchema)