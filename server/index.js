const mongoose = require('mongoose');
const io = require('./socket').io;
const http = require('./server').http;
const socketHandler = require('./socket').socketHandler; // обработчик вебсокета

const dbUrl = 'mongodb+srv://droneadmin:8APndnqKYshne9A0@cluster0-dmatc.gcp.mongodb.net/test?retryWrites=false';
const port = process.env.PORT || 3000;

io.on('connection', socketHandler);

// запуск сервера
http.listen(port, () => {
  console.log(`App started on ${port} port`);
  mongoose.connect(dbUrl, err => {
    if (err) return console.log(err);
    console.log('Db connected');
  });
});
