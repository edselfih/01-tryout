const User = require('../models/user.js');
const UserVerification = require('../models/userVerification.js');
const { generateToken, transporter } = require('../utilities/mail.js');
const {mailVerification} = require('../utilities/mailVerification.js')

module.exports.createUserPage = async (req, res) => {
    res.render('./user/create');
}

module.exports.createUser = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const user = await new User({username, email , admin : false})

        const token = generateToken()
        const userVerification = new UserVerification({
            owner: user._id,
            token
        })

        await userVerification.save();
        const newUser = await User.register(user, password);
        const newToken = await transporter.sendMail({
            from: 'edselfih@gmail.com',
            to: newUser.email,
            subject: 'Verify your email account',
            html: mailVerification(token)
        })
        // console.log(newUser, newToken);
        req.flash('success', 'verifikasi akun melalui email anda')
        res.redirect('/verification')
        

        // req.login(user, function(err) {
        //     if (err) { return next(err); }
        //     req.flash('success', 'sukses membuat user')
        //     res.redirect(`/`)
        // });
    } catch (e) {
        req.flash('error', e.message, e.stack);
        res.redirect(`/user`);
    };
}

module.exports.loginPage = async (req, res) => {
    res.render('./user/login')
}

module.exports.login = (async (req, res) => {
    req.flash('success', 'selamat datang');
    const toRedirect = req.session.toRedirect || '/';
    req.session.toRedirect = null;
    res.redirect(toRedirect);

})

module.exports.logout = async (req, res) => {
    req.logout();
    req.flash('success', 'bye');
    res.redirect('/')
}

module.exports.userVerificationPage = async (req, res) => {
    res.render('./user/verification');
}

module.exports.userVerification = async (req, res) => {
    try{
        const {username, token} = req.body;
        const user = await User.findOne({username});
        if(!user) {
            req.flash('error', 'Token atau username salah');
            res.redirect(`/verification`);
        }
        const storedToken = await UserVerification.findOne({owner:user._id});
        if(!storedToken) {
            req.flash('error', 'Token expired');
            res.redirect(`/verification`);
        }
        const isMatched = await storedToken.compareToken(token.trim())
        if (!isMatched) {
            req.flash('error', 'Token atau username salah');
            res.redirect(`/verification`);
        }
        user.verified = true;
        await UserVerification.findByIdAndDelete(storedToken._id)
        await user.save( )
        req.login(user, function(err) {
            if (err) { return next(err); }           
            req.flash('success', 'sukses membuat user')
            res.redirect(`/`)   
        });
    } catch (e) {
        req.flash('error', e.message, e.stack);
        res.redirect(`/user`);
    };
};

module.exports.resendToken = async (req, res) => {
    const user = req.user
    // console.log(req.user) // req user itu ada di session
    const token = generateToken()
    const userVerification = new UserVerification({
        owner: user._id,
        token
    })
    await userVerification.save();
    const newToken = await transporter.sendMail({
        from: 'edselfih@gmail.com',
        to: user.email,
        subject: 'Verify your email account',
        html: mailVerification(token)
    })
    res.redirect('/verification')
}
