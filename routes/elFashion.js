const express = require("express");
const dbo = require("../db/conn");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ObjectId = require("mongodb").ObjectId;

const elFashionRoutes = express.Router();


const storage = multer.diskStorage({
  destination: 'routes/uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});


const upload = multer({ storage: storage });

elFashionRoutes.route("/catalogs").post(upload.single("image"), async (req, res) => {
  const db_connect = dbo.getDbElFashion("elFashion");
  const collection = db_connect.collection("uploadedImages");

  // console.log(req.file);
  const response = await collection.insertOne({
    title: req.body.title,
    img: {
      data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
      contentType: req.body.type,

    }
  });

  const result = {
    _id: response.insertedId,
    title: "test3",
    img: response.img,
  };
  console.log(result)
  res.json(result);
});



elFashionRoutes.route("/listProviders").get(function (req, res) {
  let db_connect = dbo.getDbElFashion("elFashion");
  db_connect
    .collection("provider")
    .find({})
    .limit(10)
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

elFashionRoutes.route("/provider").post(async (req, res) => {
  const { name, phone, email, provider } = req.body;
  const db_connect = dbo.getDbElFashion("elFashion");
  const collection = db_connect.collection("provider");

  const response = await collection.insertOne({
    name,
    phone,
    email,
    provider,
  });

  const result = {
    _id: response.insertedId,
    name,
    phone,
    email,
    provider,
  };

  res.json(result);
});


module.exports = elFashionRoutes;
