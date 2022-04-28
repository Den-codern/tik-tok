import styles from "../page-styles/new.module.css";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { Player, BigPlayButton } from "video-react";
import axios from "axios";
import cookies from "js-cookie";
import { toast } from "react-toastify";
import Form from "../component/form/form";
import Spinner from "../component/spinner/spinner";
function New() {
  const inputRef = useRef(null);
  const poster =
    "https://res.cloudinary.com/shop-ai/image/upload/v1651073680/b2upvvu1o540xm6p6gne.png";
  const [media, setMedia] = useState(null);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [load, setLoad] = useState(false);
  async function handleSubmit() {
    if (!cookies.get("token")) {
      return setFormOpen(true);
    }
    if (!media) {
      return setError(true);
    }
    const videoData = new FormData();
    videoData.append("file", url);
    videoData.append("upload_preset", "user_videos");
    videoData.append("cloud_name", "shop-ai");
    setLoad(true);
    const video = await axios.post(
      "https://api.cloudinary.com/v1_1/shop-ai/upload",
      videoData
    );

    const { data } = await axios.post(
      "/api/video/create",
      {
        videoSrc: video.data.url,
      },
      {
        headers: {
          Authorization: cookies.get("token"),
        },
      }
    );
    setLoad(false);

    toast.success(data.message);
  }
  function handleChange(e) {
    const files = e.currentTarget.files;

    setMedia(URL.createObjectURL(files[0]));
    setUrl(files[0]);
  }
  if (load) {
    return <Spinner />;
  }

  return (
    <div className={styles.new}>
      <div className={styles.newWrapper}>
        <div className={styles.video}>
          <input
            style={{
              display: "none",
            }}
            name="video"
            type="file"
            accept="video/*"
            ref={inputRef}
            onChange={handleChange}
          />

          {media ? (
            <Player poster={poster} src={media}>
              <BigPlayButton position="center" />
            </Player>
          ) : (
            <div
              onClick={() => {
                inputRef.current.click();
              }}
              className={`${styles.dummyVideo} ${
                error ? styles.borderRed : ""
              }`}
            >
              <BsFillCameraVideoFill color="#d6d6d6" size={40} />
            </div>
          )}
          {error && !media ? (
            <div className={styles.error}>Загрузите видео</div>
          ) : null}
        </div>
        <button onClick={handleSubmit} className={styles.btn}>
          Добавить видео
        </button>
      </div>
      <Form formOpen={formOpen} setFormOpen={setFormOpen} />
    </div>
  );
}

export default New;
