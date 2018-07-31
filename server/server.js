// Подключает зависимости сервера
const app = require('./api').app;
const http = require('http').Server(app);
exports.http = http;

