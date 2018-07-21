const mongoose = require('mongoose');

const user = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  balance: Number
});

exports.model = mongoose.model(`User`, user);
