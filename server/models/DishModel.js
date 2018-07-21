const mongoose = require('mongoose');

const dish = mongoose.Schema({
  title: String,
  image: String,
  rating: Number,
  price: Number,
  ingredients: {
    type: Array,
    items: {type: 'string'}
  }
});

exports.model = mongoose.model(`Dish`, dish);
