const express = require("express");
const cors = require("cors");
const dbo = require("./db/conn");

require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/products"));
app.use(require("./routes/elFashion"));

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port ${port}`);
});




