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
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "bd72192ce98f0f",
        pass: "663ae98168c792"
    }
})

