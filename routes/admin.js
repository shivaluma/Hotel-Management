const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/addroom', userController.createUser);
router.post('/signin', userController.userLogin);

module.exports = router;
