'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('my app', function() {
  it('should greet the named user', function() {
    browser.get('http://www.angularjs.org');
    element(by.model('yourName')).sendKeys('Julie');

    const greeting = element(by.binding('yourName'));
    expect(greeting.getText()).eventually.equal('Hello Julie!');
  });


});
