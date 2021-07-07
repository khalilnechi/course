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
    // origin: ['http://localhost:4200','https://dev.canbe.fun','http://localhost:3000'] // list of allowed clients 
     //methods: "GET, PUT" // list of allowed methods (used in the microservice of file upload)
 }
 app.use(cors(corsOptions));
 
 
 // api routes
 app.use('/courses', require('./courses/courses.routes'));
 // Health Check route
 app.use('/healthz', require('./_middleware/healthcheck.route'));
 // swagger docs route
 app.use('/api-docs', require('./_helpers/swagger'));
 
 // global error handler
 app.use(errorHandler);
 
 // start server
 var port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3100;
 
 const server = app.listen(port, () => {
     console.log('Server listening on port ' + port);
 });

/*------------------------------------------------------------------------------------------ */
 
const db = require('./_helpers/db');
 // Socket Layer over Http Server
const socketio = require('socket.io')(server);
// On every Client Connection
socketio.on('connection', async (socket) => {
    console.log('Socket: client connected');
    
    var courseId = socket.handshake.query.courseId;
    console.log(courseId)
    const course = await getCourse(courseId);
    console.log(course.chat)
    socket.emit("getCourseChat", course.chat);
    //console.log(socket)
    socket.on('message', async (msg) => {
        console.log('received message:' + JSON.stringify(msg));
        let message={
            accountId:msg.accountId,
            content:msg.content
        }
        await add_message(courseId,message)
        socketio.emit("chat", msg);
    });
});

/***************************Chat*************************************** */

function basicDetails(course) {
    const { id, title, topic, owner, created, tags } = course;
    //return { id, title, topic, owner, created,tags }
    return course;
}
async function getCourse(id) {
    const course = await db.Course.findById(id);
    if (!course) throw 'Course not found';
    return course;
}
async function add_message(idCourse, message) {

    const course = await db.Course.findById(idCourse);
    if (!course) throw 'Course not found';
    //return course;
    course.chat.push(message)
    await course.save();

    return basicDetails(course);
}
 
 module.exports = app;