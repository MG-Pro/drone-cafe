const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UserModel = require('./models/UserModel').model;
const DishModel = require('./models/DishModel').model;

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

// возвращает список пользователей
app.get('/users/', (req, res) => {
  UserModel.find((err, users) => {
    if (err) {
      sender('err', err, res);
      return;
    }
    sender('OK', users, res);
  })
});

// возвращает пользователя или создает нового
app.post('/users/', (req, res) => {
  const userData = req.body;
  if (!userData.email) {
    sender('err', new Error('Not valid data'), res);
  }

  UserModel.findOne({email: userData.email}, (err, user) => {
    if (err) {
      sender('err', err, res);
      return;
    }
    if(user === null) {
      const newUser = new UserModel({
        name: userData.name,
        email: userData.email,
        balance: 100,
      });

      newUser.save((err, user) => {
        if (err) {
          sender('err', err, res);
          return;
        }
        sender('OK', user, res);
      });
    } else {
      sender('OK', user, res);
    }
  });
});

// загружает список доступных блюд
app.post('/dishes/all', (req, res) => {
  DishModel.create(req.body, err => {
    if (err) {
      sender('err', err, res);
      return;
    }
    sender('OK', 'Dish added', res);
  });
});

exports.app = app;
