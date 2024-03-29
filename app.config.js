module.exports = {
    NODE_SERVER_PORT: 4000,
    REQUEST_HEADER: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
    },
    EXPRESS_SESSION: {
        COOKIES_MAX_AGE: 6000000,
        SECRET: 'twitter-management'
    },
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/twitter-management",
    TWITTER_CONFIG: {
        KEY: process.env.TWITTER_CONFIG_KEY,
        SECRET:  process.env.TWITTER_CONFIG_SECRET,
        CALLBACK: process.env.CALLBACK_URL || "http%3A%2F%2Flocalhost%3A4000%2Ftwitter-callback"
    }
}