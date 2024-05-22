const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize');
const foodService = require('./food.service');

// routes
router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.get('/food/:title', getFoodByTitle);
router.delete('/:id', deleteFood);
router.put('/:id', updateFood);

module.exports = router;

function getAllFoods(req, res, next) {
    foodService.getAll()
        .then(foods => res.json(foods))
        .catch(next);
}

function getFoodById(req, res, next) {
    foodService.getById(req.params.id)
        .then(food => food ? res.json(food) : res.sendStatus(404))
        .catch(next);
}

function getFoodByTitle(req, res, next) {
    foodService.getFoodTitle(req.params.title)
        .then(food => res.json(food))
        .catch(next);
}

function deleteFood(req, res, next) {
    foodService.delete(req.params.id)
        .then(() => res.json({ message: 'Food deleted successfully' }))
        .catch(next);
}

function updateFood(req, res, next) {
    console.log('Received update request with body:', req.body); // Add this line

    // Validate request body
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        console.log('Validation error:', error.details[0].message); // Add this line
        return res.status(400).json({ error: error.details[0].message });
    }

    foodService.update(req.params.id, value)
        .then(food => res.json(food))
        .catch(next);
}

