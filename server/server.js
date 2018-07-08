const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const app = express();
const dbUrl = 'mongodb+srv://droneadmin:8APndnqKYshne9A0@cluster0-dmatc.gcp.mongodb.net/test?retryWrites=true';

const port = process.env.PORT || 3000;

const user = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
  }
});

const dish = mongoose.Schema({
  title: String,
  image: String,
  rating: Number,
  price: Number,
  ingredients: {
    type: Array,
    items: { type: 'string'},
  }
});

const UserModel = mongoose.model(`User`, user);
//const DishModel = mongoose.model(`Dish`, dish);

const sender = (status, msg, obj) => {
  obj.json({
    status: status,
    msg: msg
  })
};

app.use(express.static(__dirname + '/../app'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

app.get('/users/', (req, res) => {
  UserModel.find((err, users) => {
    if (err) {
      sender('err', err, res);
    }
    sender('OK', users, res);
  })
});

app.post('/users/', (req, res) => {
  const user = new UserModel({
    name: req.body.name
  });

  user.save(err => {
    if (err) {
      sender('err', err, res)
    }
    sender('OK', 'User added', res);
  });

});











app.listen(port, () => {
  console.log(`App started on ${port} port`);
  mongoose.connect(dbUrl, err => {
    if (err) return console.log(err);
    console.log('Db connected');
  });
});
