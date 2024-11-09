const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = 5000;

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

const database = client.db(process.env.DB_NAME);
const collection = database.collection(process.env.DB_COLLECTION);

app.use(cors());
app.use(express.json());

app.get("/api/getquestions", async (req, res) => {
  try {
    console.log("got getquestions request");
    const data = await collection.find({}).toArray(); // Convert cursor to array
    console.log(data)
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
});

app.get("/api/getquestionsemp", async (req, res) => {
  try {
    const company = req.query.company; 
    console.log("got getquestionsemp request for company: " + company);
    
    const data = await collection.find({ company: company }).toArray();
    
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
});

app.get("/api/getcompanies", async (req, res) => {
  try {
    console.log("got getquestions request");
    const data = await collection.find({}).toArray(); // Convert cursor to array
    console.log(data)
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
});

app.post("/api/post", async (req, res) => {
  try {
    const data = req.body;

    const result = await collection.insertOne(data);

    res.status(201).json({ message: "Added data succesfully", result });
  } catch (err) {
    res.status(500).json({ error: "An error occured while retrieving data" });
  }
});

app.listen(port, () => {
  console.log("server running on http://localhost:" + port);
});