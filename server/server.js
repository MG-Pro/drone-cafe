const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const app = express();
const dbUrl = 'mongodb://localhost/mongoose';

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../app'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`App started on ${port} port`);
  //mongoose.connect(dbUrl, err => {
  //  if (err) return console.log(err);
  //  console.log('Db connected');
  //});
});
