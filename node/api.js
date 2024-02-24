const express = require("express");
const { ObjectId, ServerApiVersion } = require("mongodb");
const { connection } = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://user-4545:984966313@atlascluster-iotmmxp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(uri,(error,db)=>{
  if(error)
  {
      console.log("connection Poblem");
  }
  else
  {
      console.log("connection created");
  }
})
mongoose = require("mongoose");
const app = express();
app.use(express.json());

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});