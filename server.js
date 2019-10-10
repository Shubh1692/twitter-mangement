(async function () {
    // get all the tools we need
    const express = require('express'),
        Config = require('./app.config'),
        app = express(),
        cors = require('cors'),
        session = require('express-session'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        User = require('./user'),
        path = require('path');
    // connect app to database
    await mongoose.connect(Config.MONGO_URL, {useUnifiedTopology: true}).then((success) => {
        console.info('success connect mongo db')
    }, (error) => {
        console.error('error connect mongo db', error)
    });


    app.use(cors());
 
   
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', Config.REQUEST_HEADER['Access-Control-Allow-Origin']);
        res.setHeader('Access-Control-Allow-Methods', Config.REQUEST_HEADER['Access-Control-Allow-Methods']);
        res.setHeader('Access-Control-Allow-Headers', Config.REQUEST_HEADER['Access-Control-Allow-Headers']);
        res.setHeader('Access-Control-Allow-Credentials', Config.REQUEST_HEADER['Access-Control-Allow-Credentials']);
        next();
    });
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json()); // get information from html forms
    app.use(session({ secret: Config.EXPRESS_SESSION.SECRET, cookie: { maxAge: Config.EXPRESS_SESSION.COOKIES_MAX_AGE } }));
    require('./passport')(passport, User);
    require('./route')(app, passport, User);
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.set('port', (process.env.PORT || Config.NODE_SERVER_PORT));
    app.use('/', express.static('build'));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '/build/index.html'));
    });
    app.listen(app.get('port'), () => {
        console.log(`server running at ${app.get('port')}`);
    });
}())