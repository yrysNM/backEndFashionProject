import express from "express"; 
import { ObjectId, MongoClient } from "mongodb";
import cors from "cors";
import axios from "axios";


const app = express(); 
app.use(cors());
app.use(express.json());
const port = 4000;

const uri = "mongodb+srv://yrysNM:Atom.3@cluster0.kj8tv7r.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);

client.connect().then(() => {
    console.log("Connected!");
}).catch((e) => {
    console.log(e);
});

async function run(){
    try{
        await client.connect(); 
        const db = client.db("products");
        const coll = db.collection("products");
      
          
        const docs = await axios.get("https://api.printful.com/products")
                .then(res => res.data.result)
                .catch((e) =>console.log(e));
        
        // const result = await coll.insertMany(docs); 
        console.log(docs);

    } finally {
        await client.close();
    }
}

run().catch(console.dir);

// app.post("/products", async(req, res) => {
    
// });