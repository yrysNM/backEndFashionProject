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
var _apikey = "MDkyMGIxOWYxNGFlMWE1ZjBhODM2MTE2OWU2YTQ3Y2M6YjAyMTFmOTBjN2EyZTM0NDc3MDExMTQ4NmM2NWJkMDg";

dbo.connectMongoose();

const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploadImgs'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploadImgs");
});


// media routes
elFashionRoutes.route("/file/:filename").get(async (req, res) => {
  try {

    const file = await gfs.files.findOne({ filename: req.params.filename });

    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);

  } catch (error) {
    console.log(error);
    res.send("not found :(");
  }
});

elFashionRoutes.route("/recognize").post(async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  const { imageURL, objectID, scoreLimit } = req.body;

  const formData = new FormData();
  formData.append("limit", "30");
  formData.append("tag_group", "fashion_attributes");
  formData.append("url", imageURL);

  const metaDataImg = await fetch("https://virecognition.visenze.com/v1/image/recognize", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: "Basic " + _apikey,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== "OK" && res.error[0]) {
        console.log("handle ViSenze - recognition error", res.error[0]);
        return;
      }

      const classifiedImage = {
        imageURL,
        objectID,
        objects: [],
      };

      // `res.result[0].objects` contains the objects detected in the image
      res.result[0].objects.forEach((object, index) => {
        // Store coordinates of the current object
        classifiedImage.objects[index] = {
          x1: object.box[0],
          y1: object.box[1],
          x2: object.box[2],
          y2: object.box[3],
        };

        // Format categories, attributes and scores
        object.tags.forEach(({ tag, score }) => {
          const splittedTag = tag.split(":");
          score = parseFloat(score.toFixed(2));

          if (score > scoreLimit) {
            if (!(splittedTag[0] in classifiedImage.objects[index])) {
              classifiedImage.objects[index][splittedTag[0]] = [];
            }

            classifiedImage.objects[index][splittedTag[0]].push({
              label: splittedTag[1],
              score,
            });
          }
        });
      });

      return classifiedImage;
    }).catch((err) => console.log("Image classification error", err));
  console.log(metaDataImg);
  // res.json(metaDataImg);
});

elFashionRoutes.route("/uploadImg").post(upload.single("image"), async (req, res) => {


  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `https://fast-hamlet-56846.herokuapp.com/file/${req.file.filename}`;
  console.log(imgUrl);
  res.send(imgUrl);
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
