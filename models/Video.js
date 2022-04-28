const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  src: { type: String },
  likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" } }],
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Videos", VideoSchema);
