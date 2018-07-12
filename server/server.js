const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const dbUrl = 'mongodb+srv://droneadmin:8APndnqKYshne9A0@cluster0-dmatc.gcp.mongodb.net/test?retryWrites=false';
const port = process.env.PORT || 3000;

const user = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  balance: Number
});

const dish = mongoose.Schema({
  title: String,
  image: String,
  rating: Number,
  price: Number,
  ingredients: {
    type: Array,
    items: {type: 'string'}
  }
});

const UserModel = mongoose.model(`User`, user);
const DishModel = mongoose.model(`Dish`, dish);

const sender = (status, data, obj) => {
  obj.json({
    status: status,
    data: data
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
  const userData = req.body;
  if (!userData.email) {
    sender('err', new Error('Not valid data'), res);
  }

  UserModel.findOne({email: userData.email}, (err, user) => {
    if (err) {
      sender('err', err, res);
    }
    if(user === null) {
      const user = new UserModel({
        name: userData.name,
        email: userData.email,
        balance: 100,
      });

      user.save((err, user) => {
        if (err) {
          sender('err', err, res)
        }
        sender('OK', user, res);
      });
    } else {
      sender('OK', user, res);
    }
  });
});

app.post('/dishes/all', (req, res) => {
  DishModel.create(req.body, err => {
    if (err) {
      sender('err', err, res)
    }
    sender('OK', 'Dish added', res);
  });
});

io.on('connection', (socket) => {
  socket.on('addCredit', (id) => {
    UserModel.findByIdAndUpdate(id, {$inc: {balance: 100}}, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
      socket.emit('addCredit', res);
    });

    const status = {

    };

  });

});

http.listen(port, () => {
  console.log(`App started on ${port} port`);
  mongoose.connect(dbUrl, err => {
    if (err) return console.log(err);
    console.log('Db connected');
  });
});
