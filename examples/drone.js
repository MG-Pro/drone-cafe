const drone = require('netology-fake-drone-api');

drone
  .deliver()
  .then(() => console.log('Доставлено'))
  .catch(() => console.log('Возникли сложности'));
