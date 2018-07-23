exports.OrderPage = class {

  get() {
    browser.get('/#!/order');
  }

  addCredit() {
    return element(by.buttonText('Add funds')).click();
  }

  getBalanceVal() {
    return element(by.binding('vm.balance')).getText();
  }

  openDishList() {
    return element(by.buttonText('Add dish')).click();
  }

  getDishList() {
    return element(by.className('modal'));
  }
};
