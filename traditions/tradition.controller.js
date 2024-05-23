const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize');
const traditionService = require('./tradition.service');

// routes
router.get('/', getAllTraditions);
router.get('/:id', getTraditionById);
router.get('/tradition/:title', getTraditionByTitle);
router.post('/', createTradition); 
router.delete('/:id', deleteTradition);
router.put('/:id', updateTradition);

module.exports = router;

function getAllTraditions(req, res, next) {
    traditionService.getAll()
        .then(traditions => res.json(traditions))
        .catch(next);
}

function getTraditionById(req, res, next) {
    traditionService.getById(req.params.id)
        .then(tradition => tradition ? res.json(tradition) : res.sendStatus(404))
        .catch(next);
}

function getTraditionByTitle(req, res, next) {
    traditionService.getTraditionTitle(req.params.title)
        .then(tradition => res.json(tradition))
        .catch(next);
}

function deleteTradition(req, res, next) {
    traditionService.delete(req.params.id)
        .then(() => res.json({ message: 'Tradition deleted successfully' }))
        .catch(next);
}

function updateTradition(req, res, next) {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      picture: Joi.string().required(),
      date: Joi.date().required()
    });
  
    const { error, value } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    traditionService.update(req.params.id, value)
      .then(tradition => res.json(tradition))
      .catch(next);
  }
  

function createTradition(req, res, next) {
    console.log('Received create request with body:', req.body); 

    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        picture: Joi.string().required(),
        date: Joi.date().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        console.log('Validation error:', error.details[0].message); 
        return res.status(400).json({ error: error.details[0].message });
    }

    traditionService.create(value)
        .then(tradition => res.json(tradition))
        .catch(next);
}
