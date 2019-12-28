const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var roomSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: [String]
  },
  roomClass: {
    //
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  bed: {
    type: Number, // 1 : 1 giuong, 2 : 2 giuong, 3 : 1 giuong lon
    required: true
  },
  size: {
    type: Number, // vd : 35 m2
    required: true
  },

  review: {
    total: {
      type: Number,
      default: 0
    },
    allReviews: [
      {
        name: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        star: {
          type: Number,
          required: true
        }
      }
    ]
  },
  status: {
    currentStatus: {
      type: Number, // 0 : free, 1 : booked, 2 : closed
      default: 0
    },
    bookTime: [
      {
        startDate: Number, //datetime in miliseconds
        endDate: Number, //datetime in miliseconds
        adults: Number,
        childs: Number,
        byUser: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  dateAdded: { type: Date, default: Date.now }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
