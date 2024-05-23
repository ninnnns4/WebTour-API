const config = require('config.json');
const { Op } = require('sequelize');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const feedbacks = await db.Feedback.findAll();
    return feedbacks.map(x => basicDetails(x));
}

async function getById(id) {
    const feedback = await getFeedback(id);
    return basicDetails(feedback);
}

async function create(params) {
    const feedback = new db.Feedback(params);
    feedback.verified = Date.now();

    // save account
    await feedback.save();

    return basicDetails(feedback);
}

async function update(id, params) {
    const feedback = await getFeedback(id);

    // copy params to account and save
    Object.assign(feedback, params);
    feedback.updated = Date.now();
    await feedback.save();

    return basicDetails(feedback);
}

async function _delete(id) {
    const feedback = await getFeedback(id);
    await feedback.destroy();
}

// helper functions

async function getFeedback(id) {
    const feedback = await db.Feedback.findByPk(id);
    if (!feedback) throw 'Account not found';
    return feedback;
}

function basicDetails(feedback) {
    const { id, email, message, rating } = feedback;
    return { id, email, message, rating };
}