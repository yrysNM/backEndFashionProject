const { Schema, model } = require('mongoose')


const Rating = new Schema({
    id: { type: INTEGER, primaryKey: true, auoIncrement: true },
    rate: { type: INTEGER, allowNull: false },
});

module.exports = model('Rating', Rating);
