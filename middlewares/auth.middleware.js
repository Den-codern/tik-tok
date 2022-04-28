const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(404).send("Sorry, we cannot find that!");
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  req.user = decoded;
  next();
};
