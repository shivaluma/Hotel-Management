const Room = require('../models/Room');

exports.getListRoom = (req, res) => {
  let total = 0;
  let listRooms = [];
  Room.find({}, (err, rooms) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error when get list rooms' });
    }
    total = rooms.length;
    listRooms = rooms;
  });
  return res.status(200).json({ total: total, listRooms: listRooms });
};
