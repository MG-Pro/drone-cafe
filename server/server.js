const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const drone = require('netology-fake-drone-api');

const statuses = [
  'ordered',
  'cooking',
  'delivered',
  'rejection',
  'filed',
  'deleted'
];

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

const order = mongoose.Schema({
  dish: Object,
  status: String,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const UserModel = mongoose.model(`User`, user);
const DishModel = mongoose.model(`Dish`, dish);
const OrderModel = mongoose.model(`Order`, order);

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
  const room = 'def';
  socket.join(room);

  socket.on('addCredit', (data) => {
    UserModel.findByIdAndUpdate(data.id, {$inc: {balance: data.val}}, {new: true}, (err, res) => {
      if (err) {
        console.log(err);
      }
      socket.emit('addCredit', res);
    });
  });

  socket.on('getDishes', () => {
    DishModel.find((err, res) => {
      if (err) {
        console.log(err);
      }
      socket.emit('getDishes', res);
    });
  });

  socket.on('addDishToOrder', (data) => {
    DishModel.findById(data.dishId, (err, dish) => {
      if (err) {
        console.log(err);
      }
      const order = new OrderModel({
        dish: dish,
        status: statuses[0],
        date: Date.now(),
        user: data.userId
      });
      order.save((err, res) => {
        if (err) {
          console.log(err);
        }
        socket.emit('addDishToOrder', res);
        io.in(room).emit('orderStatus', res);
      });
    });
  });

  socket.on('subCredit', (data) => {
    UserModel.findByIdAndUpdate(data.id, {$inc: {balance: - data.val}}, {new: true}, (err, res) => {
      if (err) {
        console.log(err);
      }
      socket.emit('subCredit', res);
    });
  });

  socket.on('getOrders', (userId) => {
    const param = userId ? {user: userId} : null;
    OrderModel.find(param, (err, orders) => {
      if (err) {
        console.log(err);
      }
      socket.emit('getOrders', orders);
    });
  });

  socket.on('orderStatus', (id) => {
    const autoRemoveOrder = (id) => {
      return new Promise((done, reject) => {
        setTimeout(() => {
          OrderModel.findByIdAndDelete(id, (err, res) => {
            if (err) {
              reject(err);
            }
            done(res);
          })
        }, 20000)
      })
    };

    OrderModel.findById(id, (err, order) => {
      if (err) {
        console.log(err);
      }
      const index = statuses.indexOf(order.status);
      if(order.status === 'cooking') {
        order.status = statuses[2];
        drone.deliver()
          .then(() => {
            order.status = statuses[3];
            order.save((err, res) => {
              if (err) {
                console.log(err);
              }
              socket.in(room).emit('orderStatus', res);
              autoRemoveOrder(res._id)
                .then((order) => {
                  order.status = statuses[5];
                  socket.in(room).emit('orderStatus', order);
                })
                .catch(err => console.log(err));
            });
          })
          .catch(() => {
            order.status = statuses[4];
            order.save((err, res) => {
              if (err) {
                console.log(err);
              }
              socket.in(room).emit('orderStatus', res);
            });
          });
      } else {
        order.status = statuses[index + 1];
      }
      order.save((err, res) => {
        if (err) {
          console.log(err);
        }
        io.in(room).emit('orderStatus', res);
      });

    });
  });

});

http.listen(port, () => {
  console.log(`App started on ${port} port`);
  mongoose.connect(dbUrl, err => {
    if (err) return console.log(err);
    console.log('Db connected');
  });
});
