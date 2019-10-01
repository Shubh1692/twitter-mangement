
const jwt = require('jsonwebtoken');
const createToken = (auth) => {
    return jwt.sign({
        id: auth.id
    }, 'twitter-management',
        {
            expiresIn: 60 * 120
        });
};

const generateToken = (req, res, next) => {
    req.token = createToken(req.auth);
    return next();
};

const sendToken = (req, res) => {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
};

module.exports = {
    generateToken, sendToken
};
