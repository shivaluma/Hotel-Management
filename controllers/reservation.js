const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const isEmpty = require('../utils/checkEmpty');

exports.createReservation = (req, res) => {
  // truyen vao objectid cua room va user qua body
  const { roomId, userId, arrivalDate, departureDate, adults, childs, cost, isPaid } = req.body;
  let error = {};
  let errorCount = 0;
  Room.findById(roomId, (err, room) => {
    if (err) {
      error.roomId = 'Error when find room';
      errorCount++;
      res.status(400).json({ errorCount: errorCount, error: error });
      return;
    }

    if (!room) {
      error.roomId = 'Error when find room';
      errorCount++;
      res.status(400).json({ errorCount: errorCount, error: error });
      return;
    }

    if (departureDate - endDate > 2592000000) {
      error.date = 'Cannot book more than 30 days';
      errorCount++;
      return res.status(400).json({ errorCount: errorCount, error: error });
    }
    // check xem co trung ngay ko
    let isFree = true;
    for (var j = 0; j < room.status.bookTime.length; j++) {
      let startDate = room.status.bookTime[j].startDate;
      let endDate = room.status.bookTime[j].endDate;
      if ((startDate != undefined && startDate < departureDate) || (endDate != undefined && endDate > arrivalDate)) {
        isFree = false;
      }
    }
    if (!isFree) {
      error.room = 'Room is not free';
      errorCount++;
      res.status(400).json({ errorCount: errorCount, error: error });
    } else {
      let bookTimeItem = {
        startDate: arrivalDate,
        endDate: departureDate,
        adults: adults,
        childs: childs
      };

      let reservation = new Reservation({
        room: roomId,
        user: userId,
        arrivalDate: arrivalDate,
        departureDate: departureDate,
        adults: adults,
        childs: childs,
        cost: cost,
        isPaid: isPaid
      });
      reservation.save().then(reservation => {
        bookTimeItem.reservation = reservation;
        room.status.bookTime.push(bookTimeItem);
        room.save();
        res.status(200).json({ reservation: reservation });
      });
    }
  });
};

// lay danh sach dat phong cua user dang dang nhap
// truen vao objectId cua user qua query
exports.getListReservation = (req, res) => {
  const userId = req.query.userId;
  let errCount = 0;
  let error = {};
  if (!userId) {
    errCount++;
    error.userId = 'userId is missing';
    return res.status(404).json({ errorCount: errCount, error: error });
  }
  Reservation.find({ user: userId }, (err, list) => {
    if (err) {
      errCount++;
      error.listReservation = 'Cannot get list reservation';
      return res.status(500).json({ errorCount: errCount, error: error });
    }
    res.status(200).json({ total: list.length, list: list });
  });
};

exports.cancelReservation = (req, res) => {
  const { reservationId } = req.body.reservationId;
  if (!reservationId) {
    return res.json(404).json({ message: 'No reservationId found' });
  }
  Reservation.findById(reservationId, (err, res) => {
    if (err) return res.json(500).json({ message: 'Some errors occur when get reservation' });
  });
};
