const express = require("express");
const dbo = require("../db/conn");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const ObjectId = require("mongodb").ObjectId;
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const FormData = require("form-data");
const fetch = require("cross-fetch");
const controller = require("../controller/authController");
const { check } = require("express-validator");
const elFashionRoutes = express.Router();
var gfs;
var _APIKEY = "MzU4N2Q0YzAxMjM5NmVjNDQzNTA3NzBmMWZhOTg4ODM6NWUwYjA4MjkxNzlmMjQ5ZmJlN2E1MzJmMjRlNTUzOTM";
dbo.connectMongoose();

const conn = mongoose.connection;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploadImgs'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploadImgs");
});


elFashionRoutes.route("/auth/registration").post([
  check("username", "username shoould not empty").notEmpty(),
  check("password", "Password length mini 4 max 10").isLength({ min: 4, max: 10 }),
  check("email").isEmail().normalizeEmail(),
  check("addresses.*.postalCode").isPostalCode(),
  check("phone", "phone shoydn;t empty").notEmpty(),

], controller.registration);
elFashionRoutes.route("/auth/login").post(controller.login);
elFashionRoutes.route("/auth/users").get(auth, controller.getUsers);


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
  const metaDataImg = await getImageLabels(imageURL, objectID, scoreLimit);

  res.send(metaDataImg);
});

const getImageLabels = async (imageURL, objectID, scoreLimit) => {

  const formData = new FormData();
  formData.append("limit", "5");
  formData.append("tag_group", "fashion_attributes");
  formData.append("url", imageURL);

  return await fetch("https://virecognition.visenze.com/v1/image/recognize", {
    method: "POST",
    headers: {
      Authorization: "Basic " + _APIKEY,
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

}


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
