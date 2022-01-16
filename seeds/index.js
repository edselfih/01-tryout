const mongoose = require('mongoose')
const Tryout = require('../models/tryout.js')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/tryout');
    console.log('sukses')
}
const seeding = async () => {
    await Tryout.deleteMany({})
    const makeTryout = new Tryout({
        title: "Beginner",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
    })
    await makeTryout.save()
}

seeding().then( ()=> {
    mongoose.connection.close()
})


