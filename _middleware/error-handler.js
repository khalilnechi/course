
Logger=require('../_helpers/logger');
logger=new Logger('Backend');
function errorHandler(err, req, res, next) {
    console.log("errorHandler()")
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            logger.error(err)
            console.log("\x1b[35m",err)
            return res.status(statusCode).json({ message: err });
        case err.name === 'ValidationError':
            // mongoose validation error
            console.log("\x1b[35m","ValidationError==>"+err.message)
            return res.status(400).json({ message: err.message });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            console.log("\x1b[35m","UnauthorizedError==>"+err.message)
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            console.error("\x1b[35m","Error 500 ==>"+err.message)
            return res.status(500).json({ message: err.message });
    }
}
module.exports = errorHandler;