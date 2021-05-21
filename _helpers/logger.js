require('dotenv').config();
const winston = require("winston");
require('winston-mongodb');

const config = require('./../config_db.json');


const host = process.env.DB_HOST || config.DB_HOST;
const port = process.env.DB_PORT || config.DB_PORT;
const user = process.env.DB_USER || config.DB_USER;
const pass = process.env.DB_PASS || config.DB_PASS;
const database = process.env.DB_NAME + "-" + process.env.NODE_ENV || config.DB_NAME + "-" + process.env.NODE_ENV;
console.log(database)
const uri=`mongodb://${user}:${pass}@${host}:${port}/${database}`
console.log("winston:"+uri)
timeStamp = () => {
  return new Date(Date.now()).toUTCString();
};

class CustomLogger {

  //We want to attach the service route to each instance, so when we call it from our services it gets attached to the message
  constructor(service) {
    this.log_data = null;
    this.service = service;

    const logger = winston.createLogger({
      transports: [
        //Here we declare the winston transport, and assign it to our file: allLogs.log
        new winston.transports.Console({
          name: 'info-console',
          format: winston.format.combine(winston.format.colorize())

        }),
        new winston.transports.MongoDB({
          db: uri,
          options: { useUnifiedTopology: true },
          collection: 'logs',
          service: service,
          capped: true,
          metaKey: 'meta'
        }),

      ],
      meta: true,

      format: winston.format.printf((info) => {

        //Here is our custom message
        let message = `${timeStamp()} | ${info.level} |  ${info.message} | From: ${service} `;

        return message;
      }),
    });

    this.logger = logger;
  }

  setLogData(log_data) {
    this.log_data = log_data;
  }

  async info(message) {
    this.logger.info(
      {
        meta: {
          service: this.service
        },
        message: message
      })
  }



  async debug(message) {
    this.logger.log("debug", message);
  }



  async error(message) {
    this.logger.log("error", message);
  }


}

module.exports = CustomLogger;
