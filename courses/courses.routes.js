const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const courseService = require('./course.service');
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
// routes
router.get('/test', test);
router.post('/title',getByTitle);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.put('/add_rating/:id', addRatingSchema, add_rating);
router.put('/add_tag/:id', add_tag);
router.put('/remove_tag/:id', remove_tag);
//router.put('/add_comment/:id', updateSchema, update);
router.put('/set_trainers/:id', set_trainers);
router.put('/remove_trainer/:id', remove_trainer);
router.delete('/:id', _delete);
module.exports = router;
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
/****************************************************************************************** */
function test(req, res, next) {
    console.log("hello--------------------")
    res.json({ name: "khalil" });

}

function getByTitle(req,res,next){
    courseService.getByTitle(req.body.title).then((acount)=>{
        res.json({...acount})

    }).catch(next);
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

    courseService.getById(req.params.id)
        .then(course => course ? res.json(course) : res.sendStatus(404))
        .catch(next);
}

function set_trainers(req,res,next) {
    courseService.set_trainers(req.params.id, req.body.ids)
        .then(course => {
            console.log("request = "+JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)})
        .catch(next);
}

function remove_trainer(req,res,next) {
    courseService.remove_trainer(req.params.id, req.body.accountId)
        .then(course => {
            console.log("request = "+JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)})
        .catch(next);
}
function add_tag(req,res,next) {
    courseService.add_tag(req.params.id, req.body.tag)
        .then(course => {
            console.log("request = "+JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)})
        .catch(next);
}

function remove_tag(req,res,next) {
    courseService.remove_tag(req.params.id, req.body.tag)
        .then(course => {
            console.log("request = "+JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)})
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
            console.log("request = "+JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)})
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
            
            console.log("request = "+JSON.stringify(req.body));
            console.log("=> Course updated");
            res.json(course)})
        .catch(next);
}





/*************************************delete*********************************************** */

function _delete(req, res, next) {
    // users can delete their own course and admins can delete any course
    /* if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    } */

    courseService.delete(req.params.id)
        .then(() => res.json({ message: 'Course deleted successfully' }))
        .catch(next);
}