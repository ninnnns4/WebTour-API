const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize')
const foodService = require('./food.service');

// routes
router.get('/', getAll);
router.get('/:id', getById);
router.get('/food/:title', getFoodByTitle);

module.exports = router;

function getAll(req, res, next) {
    foodService.getAll()
        .then(food => res.json(food))
        .catch(next);
}

function getById(req, res, next) {
    foodService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function getFoodByTitle(req, res, next) {
    foodService.getFoodTitle(req.params.title)
        .then(food => res.json(food))
        .catch(next);
}

