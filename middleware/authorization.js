const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "please log in to continue" });
  }

  try {
    const decrypt = jwt.verify(token, config.get("jwtsecret"));
    //console.log("abc", decrypt);
    req.user = decrypt.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "invalid session/user/request" });
  }
};
