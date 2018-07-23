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

describe('Order', function () {
  const orderPage = new OrderPage;
  before(() => {
    orderPage.get();
  });

  it('should add to user balance 100 c', function () {
    Promise.all([orderPage.addCredit(), orderPage.getBalanceVal()])
      .then(result => {
        setTimeout(() => {
          expect(+orderPage.getBalanceVal()).eventually.equal(+result[1] + 100);
        }, 2000);
      });
  });

  it('should open list of dishes', function () {
    const click = orderPage.openDishList();
    const modal = orderPage.getDishList();
    Promise.all([click, modal]).then(res => {
      expect(res[1].isDisplayed()).eventually.equal(true);
    });
  });
});



















