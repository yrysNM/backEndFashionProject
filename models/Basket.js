const { Schema, model } = require('mongoose')


const Basket = new Schema({
    id: { type: INTEGER, primaryKey: true, auoIncrement: true },
});

module.exports = model('Basket', Basket);