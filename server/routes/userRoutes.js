const express = require("express");
const verifyToken = require("../middleware/authorization");
const { getUserController, getUserFriendsController, addRemoveFriendController } = require("../controllers/userController");

const router =  express.Router();
// READ
router.get("/:id", verifyToken, getUserController);
router.get("/:id/friends", verifyToken, getUserFriendsController);
// UPDATE
router.patch("/:id/:friendId", verifyToken, addRemoveFriendController);

module.exports = router;
