const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const User = require('../models/User');
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

    if (departureDate - arrivalDate > 2592000000) {
      error.date = 'Cannot book more than 30 days';
      errorCount++;
      return res.status(400).json({ errorCount: errorCount, error: error });
    }
    // check xem co trung ngay ko
    let isFree = true;
    for (var j = 0; j < room.status.bookTime.length; j++) {
      let startDate = room.status.bookTime[j].startDate;
      let endDate = room.status.bookTime[j].endDate;
      if (startDate != undefined && startDate < departureDate && endDate != undefined && endDate > arrivalDate) {
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
  const { userId, reservationId } = req.body;
  if (!reservationId || !userId) {
    return res.status(404).json({ message: 'No reservationId and UserId found' });
  }
  Reservation.findById(reservationId, async (err, reser) => {
    if (err) {
      return res.status(500).json({ message: 'Some errors occur when get reservation' });
    }

    if (!reser) {
      return res.status(404).json({ message: 'No reservation found with this id' });
    }

    await User.findById(userId).then(async user => {
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id' });
      }
      if (user.role > 0) {
        reser.status = 0;
        await reser.save().then(p => {
          Room.find({ 'status.bookTime': { $elemMatch: { reservation: reservationId } } }).then(room => {
            for (var i = 0; i < room.status.bookTime.length; i++) {
              if (room.status.bookTime[i].reservation == reservationId) {
                room.status.bookTime.splice(i, 1);
                room.save();
                break;
              }
            }
          });

          return res.status(200).json({ message: 'Admin : Cancel success' });
        });
      }
    });

    if (reser.user != userId) {
      return res.status(400).json({ message: 'You are not allow to cancel this reservation' });
    } else {
      reser.status = 0;
      reser.save().then(p => {
        Room.find({ 'status.bookTime': { $elemMatch: { reservation: reservationId } } }).then(room => {
          for (var i = 0; i < room.status.bookTime.length; i++) {
            if (room.status.bookTime[i].reservation == reservationId) {
              room.status.bookTime.splice(i, 1);
              room.save();
              break;
            }
          }
        });
        return res.status(200).json({ message: 'Cancel success' });
      });
    }
  });
};
