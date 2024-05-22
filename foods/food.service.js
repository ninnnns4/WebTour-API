const db = require('_helpers/db');
const config = require('config.json');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getById,
    getFoodTitle,
    create,
    delete: _delete,
    update
};

function basicDetails(food) {
    const { id, title, description, picture } = food;
    return { id, title, description, picture };
}

async function getAll() {
    const foods = await db.Food.findAll();
    return foods.map(x => basicDetails(x));
}

async function create(params) { 
    const food = new db.Food(params);
    await food.save();
    return basicDetails(food);
}

async function getById(id) {
    const food = await getFood(id);
    return basicDetails(food);
}

async function getFoodTitle(title) {
    const food = await db.Food.findOne({ where: { title: title } });
    if (!food) throw "Food not found";
    return basicDetails(food);
}

async function _delete(id) {
    const food = await getFood(id);
    await food.destroy();
}

async function update(id, params) {
    const food = await getFood(id);

    // Copy params to food and save
    Object.assign(food, params);
    await food.save();

    return basicDetails(food);
}

//helpers

async function getFood(id) {
    const food = await db.Food.findByPk(id);
    if (!food) throw 'Food not found';
    return food;
}
