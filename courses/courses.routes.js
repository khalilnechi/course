const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const courseService = require('./course.service');
const authorize = require('../_middleware/authorize')
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
// routes
router.get('/test', test);
router.get('/delete_chat/:id', delete_chat);
router.post('/title', authorize(), getByTitle);
router.get('/', authorize(), getAll);
router.get('/getMyCourses', authorize(), getMyCourses);
router.get('/:id', authorize(), getById);
router.post('/', createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.put('/add_rating/:id', addRatingSchema, add_rating);
router.put('/add_tag/:id', add_tag);
router.put('/remove_tag/:id', remove_tag);
//router.put('/add_comment/:id', updateSchema, update);
router.put('/set_trainers/:id', authorize(), set_trainers);
router.put('/remove_trainer/:id', authorize(), remove_trainer);
router.put('/set_sections/:id', authorize(), set_sections);
router.delete('/:id', authorize(), _delete);
module.exports = router;
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
function test(req, res, next) {
    console.log("hello--------------------")
    res.json({ name: "khalil" });

}


function delete_chat(req, res, next) {
    courseService.delete_chat(req.params.id, req.user).then((message) => {
        res.json({
            message: message
        })

    }).catch(next);
}
function getByTitle(req, res, next) {
    courseService.getByTitle(req.body.title).then((acount) => {
        res.json({ ...acount })

    }).catch(next);
}


function getMyCourses(req, res, next) {
    console.log("req.user")
    console.log(req.user)
    courseService.getMyCourses(req.user.id)
        .then(courses => res.json(courses))
        .catch(next);
}

function getAll(req, res, next) {
    courseService.getAll()
        .then(courses => res.json(courses))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own course and admins can get any course
    /* if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    } */
    courseService.getById(req.params.id, req.user)
        .then(course => course ? res.json(course) : res.sendStatus(404))
        .catch(next);
}

function set_trainers(req, res, next) {
    courseService.set_trainers(req.params.id, req.body.ids)
        .then(course => {
            console.log("request = " + JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)
        })
        .catch(next);
}

function remove_trainer(req, res, next) {
    courseService.remove_trainer(req.params.id, req.body.accountId)
        .then(course => {
            console.log("request = " + JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)
        })
        .catch(next);
}

function set_sections(req, res, next) {
    courseService.set_sections(req.params.id, req.body.sections)
        .then(course => {
            console.log("request = " + JSON.stringify(req.body));
            console.log("=> Sections created");

            res.status(200).json({
                message: "sections created"
            })
        })

        .catch(next);
}
function add_tag(req, res, next) {
    courseService.add_tag(req.params.id, req.body.tag)
        .then(course => {
            console.log("request = " + JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)
        })
        .catch(next);
}

function remove_tag(req, res, next) {
    courseService.remove_tag(req.params.id, req.body.tag)
        .then(course => {
            console.log("request = " + JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)
        })
        .catch(next);
}
function addRatingSchema(req, res, next) {
    const RatingSchema = Joi.object({
        accountId: Joi.string(),
        rate: Joi.number(),
    });
    validateRequest(req, next, RatingSchema);
}

function add_rating(req, res, next) {
    courseService.add_rating(req.params.id, req.body)
        .then(course => {
            console.log("request = " + JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)
        })
        .catch(next);
}


const schema = Joi.object({
    title: Joi.string(),
    topic: Joi.string(),
    owner: Joi.string(),
    trainers: Joi.array(),
    attachments: Joi.string(),
    rating: Joi.array(),
    comments: Joi.array(),
    tags: Joi.array(),
    labsConfiguration: Joi.object()
});
/*************************************create*********************************************** */
function createSchema(req, res, next) {

    validateRequest(req, next, schema);
}

function create(req, res, next) {
    console.log(req.body)
    courseService.create(req.body)
        .then(course => res.json(course))
        .catch(next);
}




/*************************************update*********************************************** */
function updateSchema(req, res, next) {

    validateRequest(req, next, schema);
    //next()
}
/******************/
function update(req, res, next) {
    console.log("=================start updating=======================")
    // users can update their own course and admins can update any course
    /* if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    } */
    courseService.update(req.params.id, req.body)
        .then(course => {

            console.log("request = " + JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)
        })
        .catch(next);
}





/*************************************delete*********************************************** */

function _delete(req, res, next) {

    courseService.delete(req.params.id,req.user)
        .then((msg) => res.json({ message: msg }))
        .catch((next));
}
