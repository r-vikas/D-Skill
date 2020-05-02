const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtsecret = config.get("jwtsecret");
const { check, validationResult } = require("express-validator");

//route for user registration : first time
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "include Valid email").isEmail(),
    check("password", "enter a longer password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // 1)check if emailid exists -> send exists
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({ errors: [{ message: "User exists" }] });
      } else {
        const avatar = gravatar.url(email, { s: "150", r: "pg", d: "mm" });
        // console.log(user.id);
        user = new User({
          name,
          email,
          avatar,
          password,
        });

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        var a = await user.save();
        console.log(a);

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
      }
    } catch (err) {
      res.status(500).send("error");
    }
  }
);

module.exports = router;
