const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize');
const legendService = require('./legends.service');

// routes
router.get('/', getAllLegends);
router.get('/:id', getLegendById);
router.get('/legend/:title', getLegendByTitle);
router.post('/', createLegend); 
router.delete('/:id', deleteLegend);
router.put('/:id', updateLegend);

module.exports = router;

function getAllLegends(req, res, next) {
    legendService.getAll()
        .then(legends => res.json(legends))
        .catch(next);
}

function getLegendById(req, res, next) {
    legendService.getById(req.params.id)
        .then(legend => legend ? res.json(legend) : res.sendStatus(404))
        .catch(next);
}

function getLegendByTitle(req, res, next) {
    legendService.getLegendTitlelegend(req.params.title)
        .then(legend => res.json(legend))
        .catch(next);
}

function deleteLegend(req, res, next) {
    legendService.delete(req.params.id)
        .then(() => res.json({ message: 'Legend deleted successfully' }))
        .catch(next);
}

function updateLegend(req, res, next) {
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
  
    legendService.update(req.params.id, value)
      .then(legend => res.json(legend))
      .catch(next);
  }
  

function createLegend(req, res, next) {
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

    legendService.create(value)
        .then(legend => res.json(legend))
        .catch(next);
}
