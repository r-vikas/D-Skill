const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authorization");
const User = require("../../Models/User");
const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtsecret = config.get("jwtsecret");
const { check, validationResult } = require("express-validator");

//route to get user details
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

//route to login using id-password
router.post(
  "/",
  [
    check("email", "include Valid email").isEmail(),
    check("password", "PLease enter password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    // 1)check if email-id exists -> send exists
    try {
      let user = await User.findOne({
        email,
      });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid request" }] });
      }

      const isEqual = await bcryptjs.compare(password, user.password);

      if (!isEqual) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid request" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtsecret, { expiresIn: 100000000 }, (err, token) => {
        if (err) {
          throw err;
        } else {
          res.json({ token });
        }
      });
      //res.send("user registration successful");
    } catch (err) {
      res.status(500).send("error");
    }
  }
);

module.exports = router;
