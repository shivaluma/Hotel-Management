const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bookSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  arrivalDate: {
    type: Number,
    required: true
  },
  departureDate: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  dateAdded: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
