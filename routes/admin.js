const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const roomController = require('../controllers/room');
const reservationController = require('../controllers/reservation');

router.post('/add/room', roomController.adminAddNewRoom);
router.post('/reservation/approve', reservationController.approveReservation);
router.post('/signin', userController.userLogin);

module.exports = router;
