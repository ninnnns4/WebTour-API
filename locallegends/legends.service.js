const db = require('_helpers/db');
const config = require('config.json');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getById,
    getLegendTitle,
    create,
    delete: _delete,
    update
};

function basicDetails(legends) {
    const { id, title, description, picture, date } = legends;
    return { id, title, description, picture, date };
}

async function getAll() {
    const legends = await db.Legend.findAll();
    return legends.map(x => basicDetails(x));
}

async function create(params) {
    const legend = new db.Legend(params);
    await legend.save();
    return basicDetails(legend);
}

async function getById(id) {
    const legend = await getLegend(id);
    return basicDetails(legend);
}

async function getLegendTitle(title) {
    const legend = await db.Legend.findOne({ where: { title: title } });
    if (!legend) throw "Legend not found";
    return basicDetails(legend);
}

async function _delete(id) {
    const legend = await getLegend(id);
    await legend.destroy();
}

async function update(id, params) {
    const legend = await getLegend(id);

    Object.assign(legend, params);
    await legend.save();

    return basicDetails(legend);
}

// Helpers

async function getLegend(id) {
    const legend = await db.Legend.findByPk(id);
    if (!legend) throw 'Legend not found';
    return legend;
}
