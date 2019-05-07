const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

const app = express();

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:a97ef8a7-e054-49cf-abc5-cfd2f278baf3",
  key: "d5396442-f0f3-4aaa-915b-0c4a6d9eaf23:xh/CLJ5dRPXbLWOJG26ALFKSOR02pUlVHwgBWC+wltU="
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = 3001;
app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Running on port ${port}`);
  }
});

app.get('/', function (req, res) {
  res.send('hello world')
})

app.post("/users", (req, res) => {
  console.log(18);
  console.log(req.body);
  const { id, name } = req.body;
  console.log(id,name)
  chatkit
    .createUser({
      id: id,
      name: name
    })
    .then(() => {
      console.log('User created: ${id}');
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === "services/chatkit/user_already_exists") {
        console.log('User already exists: ${id}');
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});

app.post("/authenticate", (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});

// chatkit.createUser({
//   id: '7654321',
//   name: '7654321',
// })
//   .then(() => {
//     console.log('User created successfully');
//   }).catch((err) => {
//     console.log(err);
//   });
