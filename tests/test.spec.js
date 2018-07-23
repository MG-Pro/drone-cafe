'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const OrderPage = require('./PageObjects/OrderPage').OrderPage;

describe('Authorization', function () {
  it('should move to state "order"', function () {
    browser.get('/');
    element(by.name('name')).sendKeys('James Bond');
    element(by.name('email')).sendKeys('mg84@bk.ru', protractor.Key.ENTER);
    browser.getCurrentUrl().then(function (url) {
      expect(url).equal('http://localhost:3000/#!/order');
    });
  });
});

describe('User balance', function () {
  it('should add to user balance 100 c', function () {
    const orderPage = new OrderPage;
    orderPage.get();
    orderPage.getBalanceVal()
      .then((startVal) => {
        Promise.all([orderPage.addCredit(), orderPage.getBalanceVal()])
          .then(result => {
            console.log(result[1], startVal);
            expect(+result[1]).equal(+startVal + 100);
          });

      })





  });
});
