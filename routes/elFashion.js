const express = require("express");
const dbo = require("../db/conn");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const ObjectId = require("mongodb").ObjectId;
const upload = require("../middleware/upload");

const elFashionRoutes = express.Router();
var fileOriginalName;
var gfs;

dbo.connectMongoose();

const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploadImgs'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploadImgs");
});


// const storage = multer.diskStorage({
//   destination: 'routes/uploads',
//   filename: (req, file, cb) => {
//     cb(null, fileOriginalName = file.originalname)
//   }
// });

// const upload = multer({ storage: storage });


// media routes
elFashionRoutes.route("/file/:filename").get(async (req, res) => {

  let userImg = { img: req.params };
  const db_connect = dbo.getDbElFashion("elFashion");

  // console.log(gfs.files.filename, req.params.filename);
  const file = await gfs.files.findOne({ filename: req.params.filename });
  console.log(file)
  const readStream = gridfsBucket.openDownloadStream(file._id);
  readStream.pipe(res);
  // } catch (error) {
  //   console.log(error);
  //   res.send("not found :(");
  // }
});

elFashionRoutes.route("/uploadImg").post(upload.single("image"), async (req, res) => {
  const { title, name } = req.body;
  // var data;
  // const db_connect = dbo.getDbElFashion("elFashion");
  // const collection = db_connect.collection("uploadImgs");
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `http://localhost:5000/file/${req.file.filename}`;

  // // console.log(req.file);
  // const response = await collection.insertOne(data = {
  //   title: req.body.title,
  //   img: imgUrl,
  // });


  const result = {
    // _id: response.insertedId,
    title,
    img: imgUrl,

  }

  // res.json(result);
  res.send(imgUrl);
});


elFashionRoutes.route("/uploadImg").get((req, res) => {
  const db_connect = dbo.getDbElFashion("elFashion");
  const collection = db_connect.collection("uploadedImages");
  collection.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json(items);
    }
  });
})


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
