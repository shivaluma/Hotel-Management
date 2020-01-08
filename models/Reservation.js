const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var reservationSchema = new Schema({
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
  adults: {
    type: Number,
    required: true
  },
  childs: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  status: {
    type: Number,
    default: 1 // 1 : da tiep nhan, 2 : da duyet, 0 : da huy
  },
  dateAdded: { type: Date, default: Date.now }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
