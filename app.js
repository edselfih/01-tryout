require('dotenv').config();

// Core Modules
const path = require('path');

// Third Party Modules
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session =  require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
// const dbUrl = 'mongodb://localhost:27017/tryout';
const dbUrl = process.env.MONGO_URL
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');

// Local Modules
const tryoutRoutes = require('./routes/tryout');
const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');

const User = require('./models/user');
const AppError = require('./utilities/AppError.js');

// Database
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log('sukses terkoneksi dengan database');
}

// Middleware
const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs' , ejsMate);
app.use(mongoSanitize({
    replaceWith: '_',
}));

// Basic Securities
const scriptSrcUrls = [
    "https://code.jquery.com/jquery-3.3.1.slim.min.js",
    "https://cdn.jsdelivr.net/"
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [
    "https://api.sandbox.midtrans.com"
];
const fontSrcUrls = [
    // "https://"
];

// kyk udah diblok gitu kalau sekali salah hapus session/cache
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             "script-src-attr": ["'unsafe-inline'"],
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://image.freepik.com/",
//                 ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );

// Sessions
const secret = process.env.SECRET || 'inirahasibangetlahpokoknya150122';
const sesConfig = {
    store: mongoStore.create({
        secret,
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // time period in seconds
      }),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sesConfig));

// Auth
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash
app.use(flash());

// Local Midleware
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/tryout', tryoutRoutes);
app.use('/tryout/:tryoutId/question', questionRoutes); 
app.use('/', userRoutes);
app.get('/', (req, res) => {
    res.render('index')
});

// Error Handler untuk alamat yang tidak ditemukan, ini berlaku untuk semua path dan semua app.METHOD()
app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404))
});

// Error Handler terakhir, jadi sebelum AppError Jalan, ini midleware jalan duluan, buat ngecek error apa enggak
app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Something went wrong!!';
  res.status(statusCode).render('error', {err});
});

// Serving Port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`serving on port ${port}`)
});
