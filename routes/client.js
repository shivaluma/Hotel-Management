const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");

const roomController = require("../controllers/room");
const authenticate = passport.authenticate("jwt", { session: false });
//user
router.post("/signup", userController.createUser);
router.post("/signin", userController.userLogin);

//room
router.post("/room/book", authenticate, userController.userLogin);
router.post("/room/list", authenticate, roomController.getListRoom);
router.post("/room/search", authenticate, userController.userLogin);

module.exports = router;
