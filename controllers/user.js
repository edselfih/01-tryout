const User = require('../models/user.js');
const Result = require('../models/result.js');
const Tryout = require('../models/tryout.js');
const QuestionMark = require('../models/questionMark.js');
const UserVerification = require('../models/userVerification.js');
const {generateToken, transporter } = require('../utilities/mail.js');
const {mailVerification} = require('../utilities/mailVerification.js');

// AUTH USER
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
            subject: 'Verify your account',
            html: mailVerification(token)
        })
        // console.log(newUser, newToken);
        req.login(user, function(err) {
            if (err) { return next(err); }
            req.flash('success', 'sukses membuat user, masukan token pada email anda')
            res.redirect('/user/verification')
        });
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

// cek kenapa masih pake try catch
module.exports.userVerification = async (req, res) => {
    try{
        const {token} = req.body;
        const user = req.user
        if(!user) {
            req.flash('error', 'Harus Login terlebih dahulu');
            res.redirect(`/user/verification`);
        }
        const storedToken = await UserVerification.findOne({owner:user._id});
        if(!storedToken) {
            req.flash('error', 'Token expired');
            res.redirect(`/user/verification`);
        }
        const isMatched = await storedToken.compareToken(token.trim())
        if (!isMatched) {
            req.flash('error', 'Token atau username salah');
            res.redirect(`/user/verification`);
        }
        if (isMatched) {
            user.verified = true;
            await UserVerification.findByIdAndDelete(storedToken._id)
            await user.save()
            req.flash('success', 'sukses membuat user')
            res.redirect(`/`)   
        }
    } catch (e) {
        req.flash('error', e.message, e.stack);
        res.redirect(`/user`);
    };
};

module.exports.resendToken = async (req, res) => {
    const user = req.user
    await UserVerification.deleteMany({owner: user._id})
    // console.log(req.user) // req user itu ada di session
    const token = generateToken()
    const userVerification = new UserVerification({
        owner: user._id,
        token
    })
    await userVerification.save();
    const newToken = await transporter.sendMail({
        from: 'edselfih@gmail.com',
        to: user.email || req.session.hideEmailInForgotPage,
        subject: 'verify your account',
        html: mailVerification(token)
    })
    req.flash('success', 'token sudah dikirim ke email anda')
    res.redirect('/user/verification')
}

module.exports.updateUserPasswordPage = async (req, res) => {
    const hideEmailInForgotPage = req.session.hideEmailInForgotPage // didefine kesini = null = false
    res.render('./user/forgot', {hideEmailInForgotPage});
}

module.exports.updateUserPasswordToken = async (req, res) => {
    const {email} = req.body
    req.session.hideEmailInForgotPage = email // saat submit dimasukin email jadi true
        const token = generateToken()
    const userVerification = new UserVerification({
        owner: await User.findOne({email}),
        token
    })
    if(!userVerification) {
        req.flash('error', 'akun tidak ditemukan');
        res.redirect(`/user/forgot`);
    }
    await userVerification.save();
    const newToken = await transporter.sendMail({
        from: 'edselfih@gmail.com',
        to: email,
        subject: 'Forgot Password',
        html: mailVerification(token)
    })
    req.session.userEmail = email;
    res.redirect('/user/forgot');
}

module.exports.updateUserPassword = async (req, res) => {
    try{
        const {token} = req.body;
        const email = req.session.userEmail
        const user = await User.findOne({email});
        const storedToken = await UserVerification.findOne({owner:user._id});
        if(!storedToken) {
            req.flash('error', 'Token expired');
            res.redirect(`/user/forgot`);
        }
        const isMatched = await storedToken.compareToken(token.trim())
        if (!isMatched) {
            req.flash('error', 'Token salah');
            res.redirect(`/user/forgot`);
        }
        req.session.validUser = true
        await UserVerification.findByIdAndDelete(storedToken._id)
        res.redirect(`/user/${user._id}/update`)
    } catch (e) {
        req.flash('error', e.message, e.stack);
        res.redirect(`/user/forgot`);
    };
}

module.exports.updateUserPage = async (req, res) => {
    req.session.userEmail = null;
    req.session.hideEmailInForgotPage = null
    const {userId} = req.params
    const user = await User.findById(userId)
    res.render('./user/update', {user});
}

module.exports.updateUser = async (req, res) => {
    const {password, username} = req.body
    const user = await User.findOne({username});
    await user.setPassword(password);
    await user.save()
    res.redirect('/login')
}

// ANSWER TO
module.exports.answerQuestion = async (req, res) => {
    const {tryoutId, userId} = req.params;
    const {answer} = req.body;
    const user = await User.findById(userId);
    if (user.result.tryout) {
        for (const result of user.result) {
            console.log(result)
            if ( result._id === tryout._id ) {
                req.flash('error', 'Submit hanya bisa dilakukan sekali');
                res.redirect(`/tryout/${tryoutId}`);
            }
        }
    } else {
        const tryout = await Tryout.findById(tryoutId).populate('question');
        let mark = 0;
        const questionMark = []
        for (const question of tryout.question) {
            const userAnswer = answer[`${question._id}`] === question.key
            if(userAnswer) {
                const newQuestionMark = new QuestionMark({question : question._id, answer: answer[`${question._id}`] ,value: true})
                questionMark.push(newQuestionMark)
                await newQuestionMark.save()
                mark++
            } else {
                const newQuestionMark = new QuestionMark({question : question._id, answer: answer[`${question._id}`] ,value: false})
                questionMark.push(newQuestionMark)
                await newQuestionMark.save()
            }
        }
        const newResult = new Result({tryout: tryout._id, questionMark, mark})
        await newResult.save()
        user.result.push(newResult) 
        await user.save()
        // res.send()
        res.redirect(`/user/${user._id}/tryout/${tryout._id}/result/${newResult._id}/#${user._id}`)
    }
}
    
module.exports.resultPage = async (req, res) => {
    const {userId, tryoutId, resultId} = req.params
    const users = await User.findById(userId);
    const tryouts = await Tryout.findById(tryoutId).populate('question');
    const results = await Result.findById(resultId).populate({
        path: 'questionMark',
        populate: {
            path: 'question'
        }
    });
    res.render(`./question/user/read`, {tryouts, users, results})
}