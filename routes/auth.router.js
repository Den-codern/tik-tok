const Router = require("express");
const User = require("../models/User");
const router = new Router();
const bcrypt = require("bcrypt");
const Videos = require("../models/Video");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth.middleware");
router.post("/signup", async (req, res) => {
  const { email, password, photo, name } = req.body;
  const candidate = await User.findOne({ email });

  if (candidate) {
    return res.json({
      message: "Пользователь с такой электронной почтой существует",
      error: true,
    });
  }
  const hashPassword = bcrypt.hashSync(password, 7);
  const user = new User({ email, password: hashPassword, photo, name });
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
  user.save();

  return res.status(200).json({
    token,
    user: {
      id: user.id,
    },
    message: "Вы успешно вошли в свою учетную запись",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const candidate = await User.findOne({ email });

  if (!candidate) {
    return res.json({
      message: `Пользователь не найден`,
      error: true,
    });
  }
  const validPassword = bcrypt.compareSync(password, candidate.password);
  if (!validPassword) {
    return res.json({ message: `Введен неверный пароль`, error: true });
  }
  const token = jwt.sign({ id: candidate.id }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });

  return res.status(200).json({
    token,
    user: {
      id: candidate.id,
    },
    message: "Вы успешно вошли в свою учетную запись",
  });
});

router.get("/getUser", authMiddleware, async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  const video = await Videos.find({ video: id });
  return res.json({
    photo: user.photo,
    name: user.name,
    videoCount: video.length,
  });
});

module.exports = router;
