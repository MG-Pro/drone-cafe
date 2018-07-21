const mongoose = require('mongoose');

const order = mongoose.Schema({
  dish: Object,
  status: String,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

exports.model = mongoose.model(`Order`, order);
