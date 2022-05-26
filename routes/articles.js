const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const articleController = require("../controllers/articleController");
const favoriteController = require("../controllers/favoriteController");
const commentController = require("../controllers/commentController");

router.post("/", articleController.add);
router.get("/:id", articleController.getOne);
router.get("/", articleController.getAllArticles);
router.put("/:id", articleController.update);
router.delete("/:id", articleController.remove);

router.post("/:id/favorite", favoriteController.add);
router.delete("/:id/favorite", favoriteController.remove);

router.get("/comments/:id", commentController.getMany);
router.post("/comments/:id", commentController.add);
router.put("/comments/:id", commentController.update);
router.delete("/comments/:id", commentController.remove);

module.exports = router;
