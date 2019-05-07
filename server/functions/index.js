const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require("@pusher/chatkit-server");
const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3",
  key: "d5396442-f0f3-4aaa-915b-0c4a6d9eaf23:xh/CLJ5dRPXbLWOJG26ALFKSOR02pUlVHwgBWC+wltU="
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post("/", (req, res) => {
  const { userid, username } = req.body;
  chatkit
    .createUser({
      id: userid,
      name: username,
    })
    .then(() => {
      alert(`User created: ${username}`);
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === "services/chatkit/user_already_exists") {
        alert(`User already exists: ${username}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
     });
});

// app.post("/authenticate", (req, res) => {
//   const authData = chatkit.authenticate({ userId: req.query.user_id });
//   res.status(authData.status).send(authData.body);
// });

exports.addUser = functions.https.onRequest(app);
