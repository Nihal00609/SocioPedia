const express = require("express");
const verifyToken = require("../middleware/authorization");
const { getFeedPostController, getUserPostController, likePostController } = require("../controllers/postController");


const router =  express.Router();
// READ
router.get("/", verifyToken, getFeedPostController);
router.get("/:userId/posts", verifyToken, getUserPostController);

// UPDATE
router.patch("/:id/like", verifyToken, likePostController);

module.exports = router;
