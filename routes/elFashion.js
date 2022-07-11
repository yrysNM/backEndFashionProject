const express = require("express");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

const orderRoutes = express.Router();
orderRoutes.route("/order").get(function (req, res) {
    let db_connect = dbo.getDbElFashion("elFashion");
    db_connect
        .collection("order")
        .find({})
        .limit(10)
        .toArray((err, result) => {
            if (err) throw err;
            res.json(result);
        });
});


module.exports = orderRoutes;