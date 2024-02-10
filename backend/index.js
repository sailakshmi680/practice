let express = require("express");
let bp = require("body-parser");
let app = express();
app.use(bp.json());
const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(
  "mongodb+srv://sailakshmiyyy:33cqUBLj0fVAKaCe@cluster0.otaedk3.mongodb.net/"
);

client
  .connect()
  .then(() => console.log("Connected Successfully"))
  .catch((error) => console.log("Failed to connect", error));

const db = client.db("royal");

app.post("/create/:tablename", async (req, res) => {
  const tablename = req.params.tablename;

  console.log("tablename", tablename);

  let data = req["body"];
  try {
    if (data) {
      const result = await db.collection(tablename).insertOne(data);
      res.status(200).json({ message: "suceess" });
    }
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
});

app.get("/getList/:tablename", async (req, res) => {
  const tablename = req.params.tablename;
  const collection = db.collection(tablename);
  try {
    const result = await collection.find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
});

app.get("/getDetails/:tableName/:id", async (request, response) => {
  const id = request.params.id;
  const tablename = request.params.tableName;
  console.log("first", tablename, id);

  try {
    const result = await db
      .collection(tablename)
      .findOne({ _id: new ObjectId(id) });
    response.status(200).json(result);
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
});

app.put("/update/:tableName/:id", async (request, response) => {
  const id = request.params.id;
  const tablename = request.params.tableName;
  console.log("first", tablename);

  let data = request.body;
  console.log("data", data, id);

  try {
    const resultData = await db
      .collection(tablename)
      .updateOne({ _id: new ObjectId(id) }, { $set: data });
    console.log("resultData", resultData);

    if (resultData) {
      response.send("Data updated");
    } else {
      response.send("Data not updated");
    }
  } catch (error) {
    response.status(500).send("Internal Server Error: " + error.message);
  }
});

app.delete("/delete/:tableName/:id", async (request, response) => {
  const id = request.params.id;
  const tablename = request.params.tableName;
  console.log("first", tablename);

  let data = request.body;
  console.log("data", data, id);

  try {
    const resultData = await db
      .collection(tablename)
      .deleteOne({ _id: new ObjectId(id) });
    console.log("resultData", resultData);

    if (resultData.deletedCount > 0) {
      response.json({ message: "User Deleted Successfully" });
    } else {
      response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    response.status(500).send("Internal Server Error: " + error.message);
  }
});

app.listen(5000, (res) => {
  console.log("Listening on port 5000");
});

// "dependencies": {
//   "body-parser": "^1.20.2",
//   "express": "^4.18.2",
//   "mongodb": "^6.3.0",
//   "nodemon": "^3.0.3"
// }

//nodemon index.js to run the code
//npm i 
