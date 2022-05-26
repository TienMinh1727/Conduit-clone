const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/login", userController.login);
router.post("/", userController.register);
router.get("/", userController.getCurrentUser);
router.put("/", userController.updateCurrentUser);

module.exports = router;
