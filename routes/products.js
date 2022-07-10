const express = require("express");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

const productRoutes = express.Router();
productRoutes.route("/products").get(function (req, res) {
    let db_connect = dbo.getDb("products");
    db_connect
        .collection("products")
        .find({})
        .limit(10)
        .toArray((err, result) => {
            if (err) throw err;
            res.json(result);
        });
});

productRoutes.route("/product/:id").get((req, res) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect
        .collection("products")
        .findOne(myquery, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
});

productRoutes.route("/allProducts").get((req, res) => {
    let db_connect = dbo.getDb("products");

    db_connect
        .collection("products")
        .find({})
        .toArray((err, result) => {
            if (err) throw err;
            res.json(result);
        });
});

module.exports = productRoutes;