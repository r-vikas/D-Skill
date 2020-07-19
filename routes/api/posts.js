const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Post = require("../../Models/Post");
const User = require("../../Models/User");
const Profile = require("../../Models/Profile");
const auth = require("../../middleware/authorization");

/*
 ! test route
 */
router.get("/test", (req, res) => {
  res.send("post page working");
});

/*
 * Add new message
 */
router.post(
  "/",
  [auth, [check("message", "title is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const postObject = new Post({
        message: req.body.message,
        userName: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await postObject.save();

      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

/*
 * get all posts
 */
router.get("/allposts", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

/*
 * get post by id
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

/*
 * delete post by id
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "user not authorized to delete post" });
    }
    await post.remove();
    res.json({ msg: "post deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

/*
 * add claps to post
 */
router.put("/clap/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.claps.filter((clap) => clap.user.toString() === req.user.id).length >
      0
    ) {
      return res
        .status(400)
        .json({ msg: "you have already clapped for this post" });
    }
    post.claps.push({ user: req.user.id });
    await post.save();

    res.json(post.claps);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "server error" });
  }
});

/*
 * add claps to post
 */
router.put("/unclap/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.claps.filter((clap) => clap.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "you have not clapped this post" });
    }
    const removeClap = post.claps
      .map((clap) => clap.user.toString())
      .indexOf(req.user.id);

    post.claps.splice(removeClap, 1);

    await post.save();

    res.json(post.claps);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
