const { Schema, model } = require('mongoose')


const BasketProducts = new Schema({
    id: { type: INTEGER, primaryKey: true, auoIncrement: true },

});

module.exports = model('BasketProducts', BasketProducts);