const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const assert = chai.assert;

describe('REST API', () => {
  let server;

  before((done) => {
    require('../tests/test.server');
    setTimeout(() => {
      server = supertest.agent('http://localhost:3000');
      done();
    }, 1000);
  });

  describe('REST /users', function () {

    const user = {name: 'vasa', score: 10};
    let URL = '/users/';

    it('Пользователь создан', function (done) {
      server
        .post(URL).send(user).expect(function (res) {
        assert.equal(res.body.status, "OK");
      })
        .end(done);
    });

    it('Пользователь удален', function (done) {
      server
        .del(URL + '/1').expect('200', user)
        .end((err, res) => (err) ? done(err) : done());
    });

    it('Пользователь не удален', function (done) {
      server
        .del(URL + '/2').expect('400', {})
        .end((err, res) => (err) ? done(err) : done());
    });
  });
});
