require('dotenv').config();
Logger = require('./logger');
logger = new Logger('Backend API');

const config = require('./../config_db.json');
const mongoose = require('mongoose');


//connect to database
process.env.NODE_ENV = 'dev';

const host = process.env.DB_HOST || config.DB_HOST;
const port = process.env.DB_PORT || config.DB_PORT;
const user = process.env.DB_USER || config.DB_USER;
const pass = process.env.DB_PASS || config.DB_PASS;
const database = process.env.DB_NAME + "-" + process.env.NODE_ENV || config.DB_NAME+ "-" + process.env.NODE_ENV;
const uri = `mongodb://${user}:${pass}@${host}:${port}/${database}`;
//uri="mongodb://sofuser:sofpass@40.89.175.188:27017/soflearn-prod"
console.log("uri="+uri)

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(uri, connectionOptions)
    .then(() => {
        logger.info(`Successfully connect to mongodb://${user}:<PASSWORD>@${host}:${port}/${database}`);

    })
    .catch(err => {
        logger.error("connection error: " + err);
        process.exit();
    });;
mongoose.Promise = global.Promise;

module.exports = {
    Account: require('../entity/entity.model'),
    RefreshToken: require('../entity/refresh-token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
