const nodemailer = require('nodemailer')

module.exports.generateToken = () => {
    let token = ''
    for(let i = 0; i <= 3; i++ ) {
        const randVal = Math.round(Math.random() * 9 )
        token = token + randVal
    }
    return token;
}

module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})

