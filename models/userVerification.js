const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userVerificationSchema = new Schema ({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
});

userVerificationSchema.pre('save', async function(next) {
    if(this.isModified('token')) {
        this.token = await bcrypt.hash(this.token, 8);
    }
    next();
});

userVerificationSchema.methods.compareToken = async function (token) {
    const result = await bcrypt.compareSync(token, this.token);
    return result;
};


module.exports = mongoose.model('UserVerification', userVerificationSchema);