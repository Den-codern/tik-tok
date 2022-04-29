const express = require("express");
const cors = require("cors");
const connectDb = require("./lib/connectdb");
const PORT = process.env.PORT || 5000;
const videoRouter = require("./routes/video.router");
const authRouter = require("./routes/auth.router");
const app = express();

connectDb();

app.use(express.json());

app.use(cors());
app.use("/api/video", videoRouter);
app.use("/api/auth", authRouter);
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
