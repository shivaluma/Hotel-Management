const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: false,
    default: 0
  },
  dateAdded: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
