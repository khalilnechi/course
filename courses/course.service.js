const db = require('./../_helpers/db');
Logger = require('../_helpers/logger');
//logger = new Logger('CourseService');


module.exports = {
    getByTitle,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    add_rating,
    add_tag,
    remove_tag,
    set_trainers,
    remove_trainer,
    getMyCourses,
    set_sections
};


async function getAll() {
    const courses = await db.Course.find();
    return courses.map(x => basicDetails(x));
}

async function getMyCourses(idAccount) {
    const courses = await db.Course.find({
        $or: [
            { trainers: idAccount },
            { owner: idAccount }
        ]
    });
    return courses.map(x => basicDetails(x));
}

async function getById(id) {
    const course = await getCourse(id);
    return basicDetails(course);
}

async function getByTitle(title) {
    const course = await getCourseByTitle(title);
    return course;
}

/***************************Trainer*************************************** */

async function set_trainers(idCourse, accounts) {
    const course = await getCourse(idCourse);
    /* 
    
       if(course.trainers.indexOf(accountId)!=-1)
        throw "Trainer "+accountId+" already exist"; */


    course.trainers = accounts
    await course.save();

    return basicDetails(course);
}
async function set_sections(idCourse, sections) {
    const course = await getCourse(idCourse);

    course.sections = sections
    
    course.updated = Date.now();
    await course.save();

    return basicDetails(course);
}

async function remove_trainer(idCourse, accountId) {
    const course = await getCourse(idCourse);

    if (course.trainers.indexOf(accountId) == -1)
        throw "Trainer " + accountId + " already not exist";


    course.trainers.remove(accountId)
    await course.save();

    return basicDetails(course);
}
/***************************Tag*************************************** */
async function add_tag(idCourse, tag) {
    const course = await getCourse(idCourse);

    if (course.tags.indexOf(tag) != -1)
        throw "tag " + tag + " already exist";

    course.tags.push(tag)
    await course.save();

    return basicDetails(course);
}
async function remove_tag(idCourse, tag) {
    const course = await getCourse(idCourse);

    if (course.tags.indexOf(tag) == -1)
        throw "tag " + tag + " already not exist";


    course.tags.remove(tag)
    await course.save();

    return basicDetails(course);
}
/***************************rating*************************************** */

async function add_rating(idCourse, params) {
    const course = await getCourse(idCourse);

    // copy params to course and save
    // Object.assign(course, params);
    console.log(course.rating)
    var ratingObject = course.rating.find(ratingObject => ratingObject.accountId == params.accountId)
    console.log(ratingObject)
    if (ratingObject)
        ratingObject.rate = params.rate;
    else
        course.rating.push(params)
    await course.save();

    return basicDetails(course);
}

/***************************CRUD*************************************** */

async function create(params) {
    /* // validate
    if (await db.course.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    } */
    const course = new db.Course(params);

    // save course
    await course.save();

    return basicDetails(course);
}


async function update(idCourse, params) {
    const course = await getCourse(idCourse);
    console.log("---------------trying to update ------------------------")
    // validate (if email was changed)
    /* if (params.email && course.email !== params.email && await db.course.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    } */

    // copy params to course and save
    Object.assign(course, params);
    course.tags.push("samir")
    course.updated = Date.now();
    await course.save();

    return basicDetails(course);
}

async function _delete(idCourse) {
    const course = await getCourse(idCourse);
    await course.remove();
}
/*-------------------------------------------------------------------------------------------*/
// helper functions

async function getCourse(id) {
    const course = await db.Course.findById(id);
    if (!course) throw 'Course not found';
    return course;
}
async function getCourseByTitle(title) {
    const course = await db.Course.findOne({ title });
    if (!course) throw 'Course not found';
    console.log(course)
    return basicDetails(course);
}

function basicDetails(course) {
    const { id, title, topic, owner, created, tags } = course;
    //return { id, title, topic, owner, created,tags }
    return course;
}