const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const roomController = require('../controllers/room');

router.post('/add/room', roomController.adminAddNewRoom);
router.post('/signin', userController.userLogin);

module.exports = router;
