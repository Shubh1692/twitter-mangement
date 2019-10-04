const userRouter = require('express').Router(),
    jwt = require('jsonwebtoken'),
    Config = require('./app.config'),
    request = require('request'),
    twitterAPI = require('node-twitter-api'),
    { sortBy } = require('lodash'),
    twitter = new twitterAPI({
        consumerKey: Config.TWITTER_CONFIG.KEY,
        consumerSecret: Config.TWITTER_CONFIG.SECRET,
        callback: Config.TWITTER_CONFIG.CALLBACK,
    });
module.exports = (app, passport, User) => {
    userRouter.route('/request_token')
        .post((req, res) => {
            request.post({
                url: 'https://api.twitter.com/oauth/request_token',
                oauth: {
                    oauth_callback: Config.TWITTER_CONFIG.CALLBACK,
                    consumer_key: Config.TWITTER_CONFIG.KEY,
                    consumer_secret: Config.TWITTER_CONFIG.SECRET,
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
                    consumer_key: Config.TWITTER_CONFIG.KEY,
                    consumer_secret: Config.TWITTER_CONFIG.SECRET,
                    token: req.body.oauth_token
                },
                form: { oauth_verifier: Number(req.body.oauth_verifier) }
            }, async (err, r, body) => {
                try {
                    if (err) {
                        return res.send(400, { message: err.message });
                    }
                    const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
                    const twitterProvider = JSON.parse(bodyString);
                    twitter.verifyCredentials(twitterProvider.oauth_token, twitterProvider.oauth_token_secret, {}, async (err, userProfile) => {
                        if (err) {
                            return res.send(400, { message: err.message });
                        }
                        const user = await User.findOneAndUpdate({
                            userName: userProfile.screen_name
                        }, {
                            userName: userProfile.screen_name,
                            name: userProfile.name,
                            twitterProvider
                        }, {
                            new: true, upsert: true
                        });
                        const token = jwt.sign({
                            id: user._id
                        }, Config.EXPRESS_SESSION.SECRET);
                        return res.status(200).json({
                            token,
                            msg: 'Successfully login',
                            user: user,
                            success: true,
                        });
                    });
                } catch (error) {
                    res.send(500, error || err || body || "Error while login with twitter");
                }
            });
        });
    userRouter.route('/getTweets').get(passport.authenticate('jwt', { session: false }), (req, res) => {
        twitter.getTimeline('user_timeline', {
            screen_name: req.user.twitterProvider.screen_name
        }, req.user.twitterProvider.oauth_token, req.user.twitterProvider.oauth_token_secret, (err, mainTweets) => {
            if (err) {
                return res.send(400, 'Error while fetching tweets');
            }
            let tweets = {};
            mainTweets.forEach(tweet => {
                if (!tweets[tweet.in_reply_to_status_id_str]) {
                    tweets[tweet.in_reply_to_status_id_str] = [];
                }
                tweets[tweet.in_reply_to_status_id_str].push(tweet);
            });
            for (let i in tweets) {
                tweets[i] = sortBy(tweets[i], (tweet)=>  new Date(tweet.created_at));
            }
            tweets["null"]= tweets["null"].reverse();
            res.send({
                tweets,
                user: req.user
            });
        });
    });
    userRouter.route('/replayToTweet').post(passport.authenticate('jwt', { session: false }), (req, res) => {
        twitter.statuses('update', {
            in_reply_to_status_id: req.body.id,
            status: `${req.body.replyTweet}`,
        }, req.user.twitterProvider.oauth_token, req.user.twitterProvider.oauth_token_secret, (err, replyTweet) => {
            if (err) {
                return res.send(400, 'Error while reply a tweet');
            }
            res.send({
                replyTweet,
                user: req.user
            });
        });
    });
    app.use('/user/', userRouter);
}
