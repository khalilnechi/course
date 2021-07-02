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
    return courses.map(x => basicDetailsCourses(x));
}

async function getMyCourses(idAccount) {
    const courses = await db.Course.find({
        $or: [
            { trainers: idAccount },
            { owner: idAccount }
        ]
    });
    return courses.map(x => basicDetailsCourses(x));
}

async function getById(idCourse, user) {
    const course = await getCourse(idCourse);
    //console.log(course.trainers)
    //console.log(typeof user.id)
    //console.log("course.owner=" +typeof course.owner)
    let isAdminOfCourse = user.id === course.owner.toString()
    console.log("isAdminOfCourse=" + isAdminOfCourse)

    //Storage of visits
    if (user !== undefined && !isAdminOfCourse && course.trainers.indexOf(user.id) === -1) {
        //console.log(course.visits)
        console.log("getting course by visitor with id " + user.id)
        console.log("course.visits.find(visit=>visit.accountId===user.id)")
        let visit = course.visits.find(visit => visit.accountId.toString() === user.id)

        if (visit === undefined)//first time visit
            course.visits.push({
                accountId: user.id,
                occurences: [
                    { created: Date.now() }
                ]
            })
        else {
            // We have to calculate delay between visits
            let lastVisit = visit.occurences[visit.occurences.length - 1].created
            //console.log(lastVisit.getTime())
            //console.log(Date.now())
            var now = new Date(Date.now());
            let delay = (now - lastVisit.getTime());

            console.log("#        now :" + now.toTimeString())
            console.log("# last visit :" + lastVisit.toTimeString())
            let delayInMinutes = Math.round(delay / 60000)
            console.log(delayInMinutes + " minutes")

            if (delayInMinutes >= 10)
                visit.occurences.push({
                    created: Date.now()
                })
        }

        await course.save();
    }

    return course;
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
    sections.forEach(section => {
        console.log(section.toUpdate)
        if (section.toUpdate === true)
            section.updated = Date.now()
    });
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

function basicDetailsCourses(course) {
    const { _id, title, topic, owner, created, updated, tags, url_picture } = course;
   // return course;
    return { _id, title, topic, owner, created, updated, tags, url_picture };
}