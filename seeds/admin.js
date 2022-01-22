const mongoose = require('mongoose')
const User = require('../models/user.js')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/tryout');
    console.log('sukses')
}
const seeding = async () => {
    const makeAdmin = await User.findByIdAndUpdate('61ec31ea9791b9bf495a301d', {admin: true})
}

seeding().then( ()=> {
    mongoose.connection.close()
})
