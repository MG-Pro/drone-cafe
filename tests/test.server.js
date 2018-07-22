const chai = require('chai');
const supertest = require('supertest');
const assert = chai.assert;
const request = require('request');
const io = require('socket.io-client');
const URL = 'http://localhost:3000';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Server', function () {
  let socket;
  let userReference;
  const userEmail = 'mg84@bk.ru';
  const val = 55;
  before((done) => {
    request({
      url: `${URL}/users`,
      method: "POST",
      json: true,
      body: {email: userEmail}
    }, function (error, response) {
      if (error) console.log(error);
      userReference = response.body.data;

      socket = io.connect(URL, options);
      socket.on('connect', function () {
        done();
      });
    });
  });

  describe('Socket', () => {
    let dishList;
    let testOrder;

    after(() => {
      socket.disconnect();
    });

    it('Add credits to user balance', function (done) {
      const targetUser = Object.assign(userReference, {balance: userReference.balance + val});
      socket.emit('addCredit', {id: userReference._id, val: val});
      socket.on('addCredit', function (user) {
        assert.equal(targetUser.balance, user.balance);
        done();
      });
    });

    it('Write off credits from user balance', function (done) {
      const targetUser = Object.assign(userReference, {balance: userReference.balance - val});
      socket.emit('subCredit', {id: userReference._id, val: val});
      socket.on('subCredit', function (user) {
        assert.equal(targetUser.balance, user.balance);
        done();
      });
    });

    it('Get list of dishes', function (done) {
      socket.emit('getDishes');
      socket.on('getDishes', function (list) {
        dishList = list;
        assert.isArray(list);
        done();
      });
    });

    it('Add dish to order', function (done) {
      socket.emit('addDishToOrder', {dishId: dishList[0]._id, userId: userReference._id});
      socket.on('addDishToOrder', function (order) {
        testOrder = order;
        assert.equal(order.status, 'ordered');
        done();
      });
    });

    describe('List of order', (done) => {
      it('Get orders list of user', function () {
        socket.emit('getOrders', userReference._id);
        socket.on('getOrders', function (orders) {
          assert.isArray(orders);
        });
      });

      it('Get all orders list ', function () {
        socket.emit('getOrders');
        socket.on('getOrders', function (orders) {
          assert.isArray(orders);
          done();
        });
      });
    });

    it('Change order status', function (done) {
      socket.emit('orderStatus', testOrder._id);
      socket.on('orderStatus', function (order) {
        assert.notEqual(order.status, testOrder.status);
        done();
      });
    });
  });

  describe('REST API', () => {
    let server;
    before((done) => {
      setTimeout(() => {
        server = supertest.agent(URL);
        done();
      }, 1000);
    });

    describe('/users', function () {
      const user = {name: 'vasa', email: userEmail};
      const URL = '/users/';
      it('Get user by email', function (done) {
        server
          .post(URL).send(user).expect(function (res) {
          assert.equal(res.body.data.email, userEmail);
        })
          .end(done);
      });
    });
  });
});



