const { loginController } = require('../controllers/auth');

const express = require("express")

const router = express.Router();

router.post("/login", loginController);

module.exports = router;
