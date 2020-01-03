const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');

const roomController = require('../controllers/room');
const reservationController = require('../controllers/reservation');
const authenticate = passport.authenticate('jwt', { session: false });
//user
router.post('/signup', userController.createUser);
router.post('/signin', userController.userLogin);

//room
router.post('/room/book', authenticate, reservationController.createReservation);
router.post('/room/cancel', authenticate, reservationController.cancelReservation);
router.get('/room/list', roomController.getListRoom);
router.get('/room/search', roomController.searchRoom);
router.get('/room/info', roomController.getRoomInfo);

module.exports = router;
