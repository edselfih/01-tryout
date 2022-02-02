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
    await User.deleteMany({})
}

seeding().then( ()=> {
    mongoose.connection.close()
})
