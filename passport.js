
const JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt;
module.exports = (passport, USER) => {
    passport.serializeUser(async (user, done) => {
        done(null, {
            id: user.id
        });
    });
    passport.deserializeUser(async(userData, done) => {
        try {
            const user = await USER.findById(userData.id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'twitter-management'
    },async (jwtPayload, done) => {
        try {
            const user = await USER.findById(jwtPayload.id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

};