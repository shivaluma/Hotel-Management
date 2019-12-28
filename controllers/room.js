const Room = require('../models/Room');
const isEmpty = require('../utils/checkEmpty');
exports.getListRoom = (req, res) => {
  let total = 0;
  let listRooms = [];
  Room.find({})
    .then(rooms => {
      total = rooms.length;
      listRooms = rooms;
      return res.status(200).json({ total: total, listRooms: listRooms });
    })
    .catch(err => console.log(err));
};

exports.adminAddNewRoom = (req, res) => {
  const code = req.body.code;
  const error = {};
  Room.findOne({ code: code }, (err, room) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (room) {
      error.code = 'Code existed';
      return res.status(400).json(error);
    } else {
      const { code, price, image, roomClass, description, max, bed, size } = req.body;
      const newRoom = new Room({
        code: code,
        price: price,
        image: image,
        roomClass: roomClass,
        description: description,
        max: max,
        bed: bed,
        size: size
      });
      newRoom.save().then(room => res.status(200).json({ room: room }));
    }
  });
};

exports.searchRoom = (req, res) => {
  let { arrivalDate, departureDate, adults, childs } = req.query;
  let errCount = 0;
  let error = {};
  if (isEmpty(arrivalDate)) {
    errCount++;
    error.arrivalDate = 'No arrival date';
  }
  if (isEmpty(departureDate)) {
    errCount++;
    error.departureDate = 'No departure date';
  }
  if (isEmpty(adults)) {
    errCount++;
    error.adults = 'No adults';
  }
  if (isEmpty(childs)) {
    errCount++;
    error.childs = 'No childs';
  }

  if (errCount) return res.status(400).json({ errCount: errCount, error: error });

  // const arrival = new Date(arrivalDate).getTime();
  // const departure = new Date(departureDate).getTime();
  const persons = Number(adults) + Number(childs);
  Room.find({
    'status.currentStatus': { $lt: 2 },
    max: { $gt: persons - 1 }
  })
    .then(rooms => {
      return res.status(200).json({ total: rooms.length, listRooms: rooms });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Server error when search rooms' });
    });
};
