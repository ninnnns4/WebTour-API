const db = require('_helpers/db');
const config = require('config.json');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getById,
    getTraditionTitle,
    create,
    delete: _delete,
    update
};

function basicDetails(tradition) {
    const { id, title, description, picture } = tradition;
    return { id, title, description, picture };
}

async function getAll() {
    const traditions = await db.tradition.findAll();
    return traditions.map(x => basicDetails(x));
}

async function create(params) { 
    const tradition = new db.tradition(params);
    await tradition.save();
    return basicDetails(tradition);
}

async function getById(id) {
    const tradition = await getTradition(id);
    return basicDetails(tradition);
}

async function getTraditionTitle(title) {
    const tradition = await db.Tradition.findOne({ where: { title: title } });
    if (!tradition) throw "Tradition not found";
    return basicDetails(tradition);
}

async function _delete(id) {
    const tradition = await getTradition(id);
    await tradition.destroy();
}

async function update(id, params) {
    const tradition = await getTradition(id);

    Object.assign(tradition, params);
    await tradition.save();

    return basicDetails(tradition);
}

//helpers

async function getTradition(id) {
    const tradition = await db.Tradition.findByPk(id);
    if (!tradition) throw 'Tradition not found';
    return tradition;
}
