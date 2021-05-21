/**************
 * 
 *  BASIC_API 
 *
 * ************************* */
 require('rootpath')();

 const express = require('express');
 const app = express();
 const bodyParser = require('body-parser');
 const cookieParser = require('cookie-parser');
 const cors = require('cors');
 const errorHandler = require('./_middleware/error-handler')
 
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 app.use(cookieParser());
 // app.use(cors());
 var corsOptions = { 
     credentials: true,
     origin: ['http://localhost:4200','http://localhost:4201','http://localhost:4201','http://localhost:3000'] // list of allowed clients 
     //methods: "GET, PUT" // list of allowed methods (used in the microservice of file upload)
 }
 app.use(cors(corsOptions));
 
 
 // api routes
 app.use('/', require('./entity/entity.routes'));
 // Health Check route
 app.use('/healthz', require('./_middleware/healthcheck.route'));
 // swagger docs route
 app.use('/api-docs', require('./_helpers/swagger'));
 
 // global error handler
 app.use(errorHandler);
 
 // start server
 var port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
 
 app.listen(port, () => {
     console.log('Server listening on port ' + port);
 });
 
 
 module.exports = app;