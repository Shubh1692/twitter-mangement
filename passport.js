
const TwitterTokenStrategy = require('passport-twitter-token'),
    Config = require('./app.config');
module.exports = (passport, User) => {
    passport.use(new TwitterTokenStrategy({
        consumerKey: Config.TWITTER_CONFIG.KEY,
        consumerSecret: Config.TWITTER_CONFIG.SECRET,
        includeEmail: true
    },
        async (token, tokenSecret, profile, done) => {
            try {
                const user = await User.findOneAndUpdate({
                    userName: profile.username
                }, {
                    userName: profile.username,
                    name: profile.displayName,
                    twitterProvider: {
                        id: profile.id,
                        token,
                        tokenSecret
                    }
                }, {
                    upsert: true,
                    new: true
                });
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));

};