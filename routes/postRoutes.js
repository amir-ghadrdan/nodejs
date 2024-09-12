const express = require("express");

const postController = require("../controllers/postController");
const authenticateSessionJWT = require("../middlewares/auth");

const router = express.Router();

router.get("/", authenticateSessionJWT, postController.getAllPosts);
router.post("/", authenticateSessionJWT, postController.createPost);


router.get("/:id", authenticateSessionJWT, postController.getOnePost);
router.delete("/:id", authenticateSessionJWT, postController.deletePost);
router.patch("/:id", authenticateSessionJWT, postController.updatePost);


module.exports = router;
