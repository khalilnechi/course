const db = require('./../_helpers/db');
var fs = require('fs');
var jwt =require('jsonwebtoken');
Logger=require('../_helpers/logger');
logger=new Logger('Courses Api');

var public_key=fs.readFileSync('./public-key.txt','utf8');
module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])

    // console.log("------------------authorize()-------------")
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        async (req, res, next) => {
            
            const authHeader = req.headers['authorization']

            const token = authHeader && authHeader.split(' ')[1]
            //console.log("token="+authHeader)

            if (token == null) {
                logger.error("JWT token not existing")
                return res.sendStatus(401) 
            }     
            var legit=jwt.verify(token,public_key,{});
            req.user=legit;
            //console.log(legit)
           
            next();
        }
,
        async (req, res, next) => {
            const account = await db.Account.findById(req.user.id);
            
            const refreshTokens = await db.RefreshToken.find({ account: account.id });
             if(!account ){
                logger.error("Invalid Token");
                return res.status(401).json({ message: 'Unauthorized' });

             }
            if ( roles.length && !roles.includes(account.role)) {
                // account no longer exists or role not authorized
                logger.error("Unauthorized request by user with email: "+account.email);

                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = account.role;
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            //console.log("-----------------------> Authorized ")
            next();
        }

        // authorize based on user role
        
    ];
}