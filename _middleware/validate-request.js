
Logger=require('../_helpers/logger');
logger=new Logger('Backend API');
function validateRequest(req, next, schema) {
    console.log('Validating request ...')
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        logger.error(`Validation error: ${error.details.map(x => x.message).join(', ')}`)
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
    console.log('=> Valid request')
        
        req.body = value;
        next();// pass control to the next handler
    }
}
module.exports = validateRequest;