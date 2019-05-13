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
const app = express();
const app2 = express();
const CONSULTANT_ID = 'growiydotcom@gmail.com';

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3",
  key: "d5396442-f0f3-4aaa-915b-0c4a6d9eaf23:xh/CLJ5dRPXbLWOJG26ALFKSOR02pUlVHwgBWC+wltU="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());
app2.use(cors());

app.post("/", (req, res) => {
  const { id, name } = req.body;
  const roomId = id + "room";
  chatkit
  .createUser({
    id: id,
    name: name,
  })
  .then(() => {
    console.log(`User created: ${name}`);
    console.log("creating room");
    console.log("adding users " + id + ", " + CONSULTANT_ID + " to room " + roomId);
    chatkit.createRoom({
      creatorId: id ,
      name: roomId,
      customData: {},
      userIds: [CONSULTANT_ID,id]
    })
    .then(() => {
      console.log('Room created successfully');
      console.log('users added to room successfully');
      res.sendStatus(201);

    }).catch((err) => {
      console.log('failed to create room');
      console.log(err);
      res.sendStatus(400);

    });
  })
  .catch(err => {
    if (err.error === "services/chatkit/user_already_exists") {
      console.log(`User already exists: ${name}`);
      res.sendStatus(200);
    } else {
      console.log('failed created user ' + err.error);
      res.status(err.status).json(err);
    }
  });

  //
  //     chatkit.getUserRooms({
  //   userId: id,
  // })
  //   .then((res) => {
  //     console.log(res);
  //
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  //
  //   chatkit.getUser({
  //   id: CONSULTANT_ID,
  // })
  //   .then(user => console.log('got consultant', user))
  //   .catch(err => console.error(err))



});

app2.post("/", (req, res) => {

  const { id } = req.body;
  chatkit.getUserRooms({
  userId: id,
})
  .then((room_res) => {
    console.log(room_res);
    res.send(200,room_res);
  }).catch((err) => {
    console.log(err);
  });

});


exports.addUser = functions.https.onRequest(app);
exports.getRooms = functions.https.onRequest(app2);
