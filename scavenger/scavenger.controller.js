const express = require('express'); 
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request'); 
const authorize = require('_middleware/authorize');
const scavengerService = require('./scavenger.service');
const upload = require('_middleware/multer-config'); // Import multer configuration

// routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', upload.single('image'), createSchema, create); // Handle image upload for create
router.put('/:id', upload.single('image'), updateSchema, update); // Handle image upload for update
router.delete('/:id', _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        image: Joi.any().optional() // Optional for create, as multer handles it
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    // Extract image file path from req.file
    const image = req.file ? req.file : null;

    // Log the file details for debugging
    console.log('Uploaded file:', req.file);

    scavengerService.create({ ...req.body, image }) // Pass image path to service
        .then(scavenger => res.status(201).json(scavenger))
        .catch(next);
}

function getAll(req, res, next) {
    scavengerService.getAll()
        .then(scavengers => res.json(scavengers))
        .catch(next);
}

function getById(req, res, next) {
    scavengerService.getById(req.params.id)
        .then(scavenger => scavenger ? res.json(scavenger) : res.sendStatus(404))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        image: Joi.any().optional() // Optional for update, as multer handles it
    });
    validateRequest(req, next, schema); 
}

function update(req, res, next) {
    // Extract image file path from req.file
    const image = req.file ? req.file : null;

    // Log the file details for debugging
    console.log('Uploaded file:', req.file);

    scavengerService.update(req.params.id, { ...req.body, image }) // Pass image path to service
        .then(() => res.json({ message: 'Scavenger updated successfully' }))
        .catch(next);
}

function _delete(req, res, next) {
    scavengerService.delete(req.params.id)
        .then(() => res.json({ message: 'Scavenger deleted successfully' }))
        .catch(next);
}
