require('dotenv').config();
const mongoose = require('mongoose')
const Tryout = require('../models/tryout.js')
const dbUrl = process.env.MONGO_URL

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log('sukses')
}
const seeding = async () => {
    await Tryout.deleteMany({})
    const makeTryout = new Tryout({
        title: "Free Tier",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
        image: "https://image.freepik.com/free-vector/students-wearing-different-face-masks_23-2148603165.jpg"
    })
    const makeTryout2 = new Tryout({
        title: "Beginner",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
        image: "https://image.freepik.com/free-vector/students-wearing-mask_23-2148581674.jpg"
    })
    const makeTryout3 = new Tryout({
        title: "Expert",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
        image: "https://image.freepik.com/free-vector/students-wearing-face-masks_23-2148575487.jpg"
    })
    await makeTryout.save()
    await makeTryout2.save()
    await makeTryout3.save()
}

seeding().then( ()=> {
    mongoose.connection.close()
})


