const express = require("express");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const axios = require("axios");
const productRoutes = express.Router();


productRoutes.route("/productsOffsetTShirt/:offset").get(async function (req, res) {
    const { offset } = req.params;

    const db_connect = dbo.getDb("products");
    const collection = db_connect.collection("products");
    const data = collection.aggregate(
        [
            { $match: { type: "T-SHIRT" } },
            { $group: { _id: "$id" } },
            { $skip: parseInt(offset) + 10 },
            { $limit: 3 }
        ]).toArray();

    data.then((result) => {
        res.json(result);

    });

});

productRoutes.route("/productsFilterWomens/:offset").get(async (req, res) => {
    const { offset } = req.params;

    const db_connect = dbo.getDb("products");
    const collection = db_connect.collection("products");

    collection.find({ $text: { $search: "Women's" } }).skip(parseInt(offset) + 10).limit(3).toArray((err, result) => {
        if (err) throw err;

        res.json(result);

    });
});

productRoutes.route("/productsFilterMens").get(async (req, res) => {
    const db_connect = dbo.getDb("products");
    const collection = db_connect.collection("products");

    collection.find({ $text: { $search: "Men's" } }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);

    });
});

productRoutes.route("/productsFilterToddler").get(async (req, res) => {
    const db_connect = dbo.getDb("products");
    const collection = db_connect.collection("products");

    collection.find({ $text: { $search: "Toddler" } }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);

    });
});

productRoutes.route("/productsFilterShoes").get((req, res) => {

    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "SHOES" }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });
});

/**
 * @param {FILTER requests accessories}
 */
productRoutes.route("/productsFilterJewelry").get((req, res) => {

    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "JEWELRY" }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });
});

productRoutes.route("/productsFilterPhoneCase").get((req, res) => {

    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "PHONE-CASE" }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });
});

/**
 * @param {other}
 */
productRoutes.route("/productsFilterEmbroidery").get((req, res) => {

    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "EMBROIDERY" }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });
});

productRoutes.route("/productsFilterSublimation").get((req, res) => {

    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "SUBLIMATION" }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });
});

productRoutes.route("/productsFilterMug").get((req, res) => {

    let db__connect = dbo.getDb("products");
    db__connect.collection("products").find({ type: "MUG" }).toArray((err, result) => {
        if (err) throw err;

        res.json(result);
    });
});



productRoutes.route("/productsOffsetEmbro/:offset").get(async function (req, res) {
    const { offset } = req.params;

    const db_connect = dbo.getDb("products");
    const collection = db_connect.collection("products");

    const data = collection.aggregate(
        [
            { $match: { type: "EMBROIDERY" } },
            { $group: { _id: "$id" } },
            { $skip: parseInt(offset) + 10 },
            { $limit: 3 }
        ]).toArray();

    data.then((result) => {
        res.json(result);

    });


});

productRoutes.route("/productsOffsetMUG/:offset").get(async function (req, res) {
    const { offset } = req.params;

    const db_connect = dbo.getDb("products");
    const collection = db_connect.collection("products");

    const data = collection.aggregate(
        [
            { $match: { type: "MUG" } },
            { $group: { _id: "$id" } },
            { $skip: parseInt(offset) + 10 },
            { $limit: 3 }
        ]).toArray();

    data.then((result) => {
        res.json(result);

    });


});

productRoutes.route("/productsOffsetShoes/:offset").get(async function (req, res) {
    const { offset } = req.params;

    const db_connect = dbo.getDb("products");
    const collection = db_connect.collection("products");

    const data = collection.aggregate(
        [
            { $match: { type: "SHOES" } },
            { $group: { _id: "$id" } },
            { $skip: parseInt(offset) + 10 },
            { $limit: 4 }
        ]).toArray();

    data.then((result) => {
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