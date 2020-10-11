const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongodb = require("mongodb")
const mongoClient = mongodb.MongoClient;
const cors = require("cors");
require('dotenv').config();
const url = "mongodb+srv://Tnahsin79:tnahsin79@guvi-zen.iisub.mongodb.net?retryWrites=true&w=majority";
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000"
}));
//origin:"https://trusting-easley-94aada.netlify.app"
//origin:"http://localhost:3001"

//student data
//console.log(process.env.URL);
console.log("server started...");
app.get("/students", async function (req, res) {
  let client = await mongoClient.connect(url);
  try {
    let db = client.db("react-student-task");
    let studentArray = await db.collection("student").find().toArray();
    client.close();
    res.json(studentArray);
  }
  catch (error) {
    client.close();
    console.log(error);
    res.json({
      message: error
    });
  }
});
app.post("/student", async function (req, res) {
  let client = await mongoClient.connect(url);
  try {
    let db = client.db("react-student-task");
    let insertedStudent = await db.collection("student").insertOne({
      Name: req.body.Name,
      Email: req.body.Email,
      Address1: req.body.Address1,
      Address2: req.body.Address2,
      Country: req.body.Country,
      State: req.body.State,
      City: req.body.City,
      Gender: req.body.Gender,
      Status: req.body.Status,
      Food: req.body.FavFood,
      Color: req.body.FavColor
    });
    console.log(insertedStudent.insertedId);
    client.close();
    res.json({
      message: "Student created",
      id: insertedStudent.insertedId
    });
  }
  catch (error) {
    client.close();
    res.json({
      message: error
    });
  }
});

app.put("/update", async function (req, res) {
  let client = await mongoClient.connect(url);
  try {
    let sid = req.body.sid;
    //let client = await mongoClient.connect(url);
    let db = client.db("react-student-task");

    let student = await db.collection("student")
      .findOne({ _id: mongodb.ObjectID(sid) });

    if (student) {
      await db.collection("student")
        .findOneAndUpdate(
          { _id: mongodb.ObjectID(sid) },
          {
            $set: {
              Name: req.body.Name,
              Email: req.body.Email,
              Address1: req.body.Address1,
              Address2: req.body.Address2,
              Country: req.body.Country,
              State: req.body.State,
              City: req.body.City,
              Gender: req.body.Gender,
              Status: req.body.Status,
              Food: req.body.FavFood,
              Color: req.body.FavColor
            }
          }
        );
      res.json({
        message: "Database updated"
      });
    }
    else {
      res.json({
        message: "No student found"
      });
    }
    client.close();
  }
  catch (error) {
    client.close();
    res.json({
      message: error
    });
  }
});

app.delete("/delete", async function (req, res) {
  let client = await mongoClient.connect(url);
  try {
    let sid = req.body.delsid;
    //let client = await mongoClient.connect(url);
    let db = client.db("react-student-task");

    let student = await db.collection("student")
      .findOne({ _id: mongodb.ObjectID(sid) });

    if (student) {
      await db.collection("student")
        .deleteOne(
          { _id: mongodb.ObjectID(sid) }
        );
      res.json({
        message: "Data deleted"
      });
    }
    else {
      res.json({
        message: "No student found"
      });
    }
    client.close();
  }
  catch (error) {
    client.close();
    res.json({
      message: error
    });
  }
});
const port = process.env.PORT || 3001;
app.listen(port);
