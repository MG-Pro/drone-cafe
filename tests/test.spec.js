'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

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

