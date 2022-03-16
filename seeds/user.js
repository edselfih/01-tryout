require('dotenv').config();
const mongoose = require('mongoose')
const User = require('../models/user.js')
const dbUrl = process.env.MONGO_URL

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log('sukses')
}
const seeding = async () => {
    await User.findByIdAndUpdate('6210b796397bab250fdb2f1d', {$pull: {tryout: '623206d7f1ec737335330710'}})
}

seeding().then( ()=> {
    mongoose.connection.close()
})
