const userRouter = require('express').Router(),
    { generateToken, sendToken } = require('./token-management'),
    request = require('request');
module.exports = (app, passport) => {
    userRouter.route('/auth/twitter/reverse')
        .post((req, res) => {
            request.post({
                url: 'https://api.twitter.com/oauth/request_token',
                oauth: {
                    oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
                    consumer_key: '4kjMmNS3P2UNwxs8upiKfMU9a',
                    consumer_secret: '4FXp3xkQvN0xxPdtEWqUsgHNMxCgIldzhDunR3d0TsuDvzWnXg'
                }
            }, (err, r, body) => {
                if (err) {
                    return res.send(500, { message: err.message });
                }
                var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
                res.send(JSON.parse(jsonStr));
            });
        });
    userRouter.route('/auth/twitter')
        .post((req, res, next) => {
            console.log(req.query)
            request.post({
                url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
                oauth: {
                    consumer_key: '4kjMmNS3P2UNwxs8upiKfMU9a',
                    consumer_secret: '4FXp3xkQvN0xxPdtEWqUsgHNMxCgIldzhDunR3d0TsuDvzWnXg',
                    token: req.query.oauth_token
                },
                form: { oauth_verifier: req.query.oauth_verifier }
            }, function (err, r, body) {
                try {
                    if (err) {
                        return res.send(500, { message: err.message });
                    }
                    console.log('body', body);
                    const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
                    const parsedBody = JSON.parse(bodyString);
                    req.body['oauth_token'] = parsedBody.oauth_token;
                    req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
                    req.body['user_id'] = parsedBody.user_id;
                    next();
                } catch (error) {
                    res.send(400, err || body || "Error while login with twitter");
                }
            });
        }, passport.authenticate('twitter-token', { session: false }), function (req, res, next) {
            if (!req.user) {
                return res.send(401, 'User Not Authenticated');
            }
            // prepare token for API
            req.auth = {
                id: req.user.id
            };
            return next();
        }, generateToken, sendToken);
    app.use('/user/', userRouter);
}
