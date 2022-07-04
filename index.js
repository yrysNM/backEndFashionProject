import express from "express";
import { ObjectId, MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

const uri = "mongodb+srv://yrysNM:Atom.3@cluster0.kj8tv7r.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

client.connect().then(() => {
    console.log("connected!");
}).catch((e) => {
    console.log(e);
});

app.get("/products", async (req, res) => {
    const db = client.db("products");
    const collection = db.collection("products");
    const rand = Math.random() * (10 - 5) + 5;
    const result = await collection.find({}).limit(10).toArray();

    res.send(result);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});