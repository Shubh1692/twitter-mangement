const userRouter = require('express').Router(),
    jwt = require('jsonwebtoken');
request = require('request');
module.exports = (app, passport, User) => {
    userRouter.route('/request_token')
        .post((req, res) => {
            request.post({
                url: 'https://api.twitter.com/oauth/request_token',
                oauth: {
                    oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
                    consumer_key: '4kjMmNS3P2UNwxs8upiKfMU9a',
                    consumer_secret: '4FXp3xkQvN0xxPdtEWqUsgHNMxCgIldzhDunR3d0TsuDvzWnXg'
                },
                json: true,
            }, (err, r, body) => {
                if (err) {
                    return res.send(500, { message: err.message });
                }
                var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
                res.send(JSON.parse(jsonStr));
            });
        });
    userRouter.route('/access_token')
        .post(async (req, res) => {
            request.post({
                url: `https://api.twitter.com/oauth/access_token?oauth_verifier=${req.body.oauth_verifier}`,
                oauth: {
                    consumer_key: '4kjMmNS3P2UNwxs8upiKfMU9a',
                    consumer_secret: '4FXp3xkQvN0xxPdtEWqUsgHNMxCgIldzhDunR3d0TsuDvzWnXg',
                    token: req.body.oauth_token
                },
                form: { oauth_verifier: Number(req.body.oauth_verifier) }
            }, async (err, r, body) => {

                try {
                    if (err) {
                        return res.send(500, { message: err.message });
                    }
                    const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
                    const parsedBody = JSON.parse(bodyString);
                    req.body['oauth_token'] = parsedBody.oauth_token;
                    req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
                    req.body['user_id'] = parsedBody.user_id;
                    console.log('err, r, body', err, body)
                    const user = await User.findOneAndUpdate({
                        userName: parsedBody.screen_name
                    }, {
                        userName: parsedBody.screen_name,
                        name: "",
                        twitterProvider: parsedBody
                    }, {
                        new: true, upsert: true
                    });
                    const token = jwt.sign({
                        id: user._id
                    }, 'twitter-management');
                    return res.status(200).json({
                        token,
                        msg: 'Successfully login',
                        user: user,
                        success: true
                    });
                } catch (error) {
                    res.send(400, error || err || body || "Error while login with twitter");
                }
            });
        });
    userRouter.route('/getTweets').get(passport.authenticate('jwt', { session: false }), (req, res) => {
        console.log(req.user);
        res.send(200);
    })
    app.use('/user/', userRouter);
}
