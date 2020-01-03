const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');

const roomController = require('../controllers/room');
const authenticate = passport.authenticate('jwt', { session: false });
//user
router.post('/signup', userController.createUser);
router.post('/signin', userController.userLogin);

//room
router.post('/room/book', authenticate, userController.userLogin);
router.get('/room/list', roomController.getListRoom);
router.get('/room/search', roomController.searchRoom);
router.get('/room/info', roomController.getRoomInfo);

module.exports = router;
