const express = require("express");
const fs = require("fs");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

// const uri = "mongodb+srv://sailakshmi:YtScqwXoX1CiY4u8@cluster0.otaedk3.mongodb.net/";
// const uri = "mongodb+srv://sailakshmiyyy:haNS6vGV7RcOqvpX@cluster0.otaedk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const uri = "mongodb+srv://sailakshmiyyy:OP4sGUs8ZRoqAc0X@cluster0.imfqhb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dataBase = client.db("sample_airbnb");
const collection = dataBase.collection("listingsAndReviews");

app.get("/", async (req, res) => {
  res.send("App running");
});

app.get("/getList", async (req, res) => {
    try {
      const result = await collection.find().limit(200).toArray();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        error: `Internal Server Error: ${error.message}`,
      });
    }
  });
  

app.listen(8000, () => {
  console.log(`Server running on ${8000}`);
  console.log(`http://localhost:${8000}`);
});
