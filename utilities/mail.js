const nodemailer = require('nodemailer')

module.exports.generateToken = () => {
    let token = ''
    for(let i = 0; i <= 3; i++ ) {
        const randVal = Math.round(Math.random() * 9 )
        token = token + randVal
    }
    return token;
}

// module.exports.transporter = nodemailer.createTransport({
//     service: 'yahoo',
//     host: 'smtp.mail.yahoo.com',
//     port: 587, //587 atau 465
//     logger: true ,
//     secure: true,
//     debug: false,
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS
//     }
// })

module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, //587 atau 465
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})
