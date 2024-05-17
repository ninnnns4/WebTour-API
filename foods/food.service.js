const db = require('_helpers/db');
const config = require('config.json');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getById,
    getFoodTitle

};
function basicDetails(food) {
    const { id, title, description, picture} = food;
    return { id, title, description, picture}; // Include picturePath in the returned object
}

async function getAll() {
    const foods = await db.Food.findAll();
    return foods.map(x => basicDetails(x));
}

async function getById(id) {
    const food = await getFood(id);
    return basicDetails(food);
}

async function getFoodTitle(title) {
    const food = await db.Food.findOne({where: { title: title}});
    if (!food) throw "Food not found";
    return basicDetails(food);
}

//helpers

async function getFood(id) {
    const food = await db.Food.findByPk(id);
    if (!food) throw 'Food not found';
    return food;
}