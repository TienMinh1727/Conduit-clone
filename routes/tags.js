const express = require("express");
const router = express.Router();
const TagController = require("../controllers/tagControllers");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get("/", TagController.getAllTags);
router.get("/:id", TagController.getTag);
router.post("/", TagController.createTag);
router.patch("/:id", TagController.updateTag);
router.delete("/:id", TagController.deleteTag);

module.exports = router;
