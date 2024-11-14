const redis = require('redis');
const dotenv = require('dotenv')
dotenv.config({path:"./config.env"})

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
}); //connect redis to worker so that it can catch requests
client.connect();

module.exports = client;