// Подключает зависимости сервера
const app = require('./routes').app;
const http = require('http').Server(app);
exports.http = http;

