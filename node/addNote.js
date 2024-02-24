const express = require("express");
const bp = require("body-parser");
const app = express();
app.use(bp.json());
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(
  "mongodb+srv://sailakshmiyyy:LQGEBxzExrgbtM1O@cluster0.imfqhb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
client
  .connect()
  .then(() => console.log("Connected Successfully"))
  .catch((error) => console.log("Failed to connect", error));

const db = client.db("NodeProject");

app.post("/createNotes", async (req, res) => {
  const notesCollection = db.collection("notes");
  const { title, content } = req.body;
  const newNote = {
    title: title,
    content: content,
  };

  try {
    const result = await notesCollection.insertOne(newNote);
    res.json({ success: true, message: "Note inserted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to insert note", error: err });
  }
});


app.get("/getNotes", async (req, res) => {
  try {
    const notesCollection = db.collection("notes");
    const result = await notesCollection.find().toArray();
    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});


app.get("/getDetails/:id", async (req, res) => {
  const id = req.params.id; 
  try {
    const result = await db.collection('notes').findOne({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(`ERROR : ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteNote/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const notesCollection = db.collection('notes');
    const result = await notesCollection.deleteOne({ _id: new ObjectId(id) });
    // console.log("result", result);
    if (result.deletedCount > 0) {
      res.json({ success: true, message: "Note Deleted Successfully" });
    } else {
      res.status(404).json({ success: false, message: "Note not found" });
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/updateNote/:id",async(req,res) => {
  const id = req.params.id;
  let data = req.body
 
  try {
    let notesCollection = db.collection("notes");
    const updateResult = await notesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    console.log(updateResult)

    if (updateResult.modifiedCount > 0) {
      res.json({ success: true, message: "Note Updated Successfully" });
    } else {
      res.status(404).json({ success: false, message: "Note not found or data unchanged" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
  }
})




app.get("/", async (req, res) => {
  res.send("App running");
});

app.listen("4000", async (req, res) => {
  console.log("listening on port 4000");
});

// client.connect()
//   .then(client => {
//     console.log("connected successfully")
//     const db = client.db("NodeProject");
//     const notesCollection = db.collection("notes");

//     // app.post("/createNotes", async (req, res) => {
//     //   const { title, content } = req.body;

//     //   const newNote = {
//     //     title: title,
//     //     content: content
//     //   };

//     //   notesCollection.insertOne(newNote)
//     //     .then(result => {
//     //       res.json({ success: true, message: "Notes inserted successfully" });
//     //     })
//     //     .catch(err => {
//     //       res.status(500).json({ success: false, message: "Failed to insert note", error: err });
//     //     });
//     // });

//     app.get("/", async (req, res) => {
//       res.send("App running");
//     });

//     app.listen('4000', async (req, res) => {
//       console.log("listening on port 4000");
//     });
//   }).catch(err => console.log("Failed to connect", err));
