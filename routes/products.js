const express = require("express");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

const productRoutes = express.Router();
productRoutes.route("/products").get(function (req, res) {
    let db_connect = dbo.getDb("products");
    db_connect
        .collection("products")
        .find({ type: "T-SHIRT" })
        .limit(10)
        .toArray((err, result) => {
            if (err) throw err;
            // console.log(result);
            res.json(result);
        });
});

productRoutes.route("/productsTShirt").get((req, res) => {


    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "T-SHIRT" }).limit(4).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });


});

productRoutes.route("/productsEmbro").get((req, res) => {


    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "EMBROIDERY" }).limit(4).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });


});


productRoutes.route("/productsShoes").get((req, res) => {

    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "SHOES" }).limit(2).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });
});

productRoutes.route("/productsMug").get((req, res) => {
    let db__connect = dbo.getDb("prodcuts");
    db__connect.collection("products").find({ type: "MUG" }).limit(3).toArray((err, result) => {
        if (err) throw err;

        res.json(result);

    })
})


productRoutes.route("/product/:id").get((req, res) => {
    let db_connect = dbo.getDb();
    let myquery = { id: parseInt(req.params.id) };

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