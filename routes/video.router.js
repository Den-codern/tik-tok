const Router = require("express");
const router = new Router();
const Videos = require("../models/Video");
const authMiddleware = require("../middlewares/auth.middleware");
router.get("/", async (req, res) => {
  const videos = await Videos.find();
  return res.json(videos);
});
router.post("/like", authMiddleware, async (req, res) => {
  const { videoId } = req.body;
  const { id } = req.user;

  const video = await Videos.findById(videoId);
  const isLiked =
    video.likes.filter((like) => {
      return like.user.toString() === id;
    }).length > 0;
  if (isLiked) {
    const index = video.likes.map((like) => like.user.toString()).indexOf(id);

    await video.likes.splice(index, 1);

    await video.save();

    return res.json({
      isLiked: true,
    });
  }
  await video.likes.push({
    user: id,
  });

  await video.save();
  return res.json({
    isLiked: false,
  });
});

router.post("/create", authMiddleware, async (req, res) => {
  const { videoSrc } = req.body;
  console.log(videoSrc);
  const { id } = req.user;

  const video = new Videos({ src: videoSrc, likes: [], video: id });
  await video.save();
  return res.json({
    message: "Видео сохранено",
  });
});

module.exports = router;
