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
    await User.findByIdAndUpdate('61f9158c752b6f2c64f5193a', {$pull: {result: '61fa1ceba7dc12fbdaf2b935'}})
}

seeding().then( ()=> {
    mongoose.connection.close()
})
