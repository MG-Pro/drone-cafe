const drone = require('netology-fake-drone-api');
const http = require('./server').http;
const UserModel = require('./models/UserModel').model;
const DishModel = require('./models/DishModel').model;
const OrderModel = require('./models/OrderModel').model;
const io = require('socket.io')(http);

const statuses = [
  'ordered',
  'cooking',
  'delivered',
  'rejection',
  'filed',
  'deleted'
];

exports.socketHandler = (socket) => {
  const room = 'def';
  socket.join(room);

  // добавление кредитов пользователю
  socket.on('addCredit', (data) => {
    UserModel.findByIdAndUpdate(data.id, {$inc: {balance: data.val}}, {new: true}, (err, res) => {
      if (err) {
        console.log(err);
      }
      socket.emit('addCredit', res);
    });
  });

  // получение списка блюд
  socket.on('getDishes', () => {
    DishModel.find((err, res) => {
      if (err) {
        console.log(err);
      }
      socket.emit('getDishes', res);
    });
  });

  // добавление блюда к заказу
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

  // списание кредитов с баланса пользователя
  socket.on('subCredit', (data) => {
    UserModel.findByIdAndUpdate(data.id, {$inc: {balance: - data.val}}, {new: true}, (err, res) => {
      if (err) {
        console.log(err);
      }
      socket.emit('subCredit', res);
    });
  });

  // получение списка всех заказов
  socket.on('getOrders', (userId) => {
    const param = userId ? {user: userId} : null;
    OrderModel.find(param, (err, orders) => {
      if (err) {
        console.log(err);
      }
      socket.emit('getOrders', orders);
    });
  });

  // меняет статус заказа
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
        }, 120000)
      })
    };
    OrderModel.findById(id, (err, order) => {
      if (err) {
        console.log(err);
      }
      const index = statuses.indexOf(order.status); // получает индекс текущего статуса
      if(order.status === 'cooking') {
        order.status = statuses[2];
        drone.deliver() // запускает доставку
          .then(() => { // доставка завершена
            order.status = statuses[3];
            order.save((err, res) => {
              if (err) {
                console.log(err);
              }
              socket.in(room).emit('orderStatus', res);
              autoRemoveOrder(res._id) // автоудаление заказа
                .then((order) => {
                  order.status = statuses[5];
                  socket.in(room).emit('orderStatus', order);
                })
                .catch(err => console.log(err));
            });
          })
          .catch(() => { // ошибка доставки
            order.status = statuses[4];
            order.save((err, res) => {
              if (err) {
                console.log(err);
              }
              socket.in(room).emit('orderStatus', res);
              autoRemoveOrder(res._id) // автоудаление заказа
                .then((order) => {
                  order.status = statuses[5];
                  socket.in(room).emit('orderStatus', order);
                })
                .catch(err => console.log(err));
            });
          });
      } else { // перевод заказа в след. статус
        order.status = statuses[index + 1];
      }
      order.save((err, res) => { // ответ с заказом в новом статусе
        if (err) {
          console.log(err);
        }
        io.in(room).emit('orderStatus', res);
      });
    });
  });
};
exports.io = io;





