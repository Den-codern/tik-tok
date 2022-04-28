import styles from "../page-styles/home.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Video from "../component/video/video";
import { createRef, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../component/spinner/spinner";
import Form from "../component/form/form";
import cookies from "js-cookie";
import { useRoutes } from "react-router-dom";
const createRefs = (items = []) => {
  const refs = {};
  for (let i = 0; i < items.length; i++) {
    refs[i] = createRef(null);
  }
  return refs;
};

function Home() {
  const [videos, setVideos] = useState(null);
  const [refs, setRefs] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [videoPause, setVideoPause] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/video");
      return res;
    }
    const res = fetchData();

    res.then(({ data }) => {
      const videoState = data.map((video, i) => {
        return {
          id: i,
          state: i === 0 ? "play" : "pause",
        };
      });
      setVideos(data);
      setRefs(createRefs(data));
      setVideoPause(videoState);
    });
  }, []);

  return (
    <div
      className={styles.home}
      onClick={(e) => {
        if (e.target.id === "form") {
          setFormOpen(false);
        }
      }}
    >
      <div className={styles.feed}>
        {videos ? (
          <Swiper
            className={styles.swiper}
            spaceBetween={50}
            slidesPerView={1}
            direction="vertical"
            onSlideChange={({ activeIndex }) => {
              for (const refsId in refs) {
                refs[refsId].current.pause();
                refs[refsId].current.currentTime = 0;
              }
              refs[activeIndex].current.play();
              setVideoPause((state) => {
                const videoState = [...state];
                for (let i = 0; i < videoState.length; i++) {
                  videoState[i].state = "pause";
                }
                videoState[activeIndex].state = "play";
                return videoState;
              });
            }}
            onSwiper={() => {
              for (const refsId in refs) {
                refs[refsId].current.pause();
                refs[refsId].current.currentTime = 0;
              }
            }}
          >
            {videos.map((video, i) => {
              return (
                <SwiperSlide key={video._id}>
                  <Video
                    formOpen={formOpen}
                    setFormOpen={setFormOpen}
                    ref={refs[i]}
                    videoId={video._id}
                    videoPause={videoPause[i]}
                    src={video.src}
                    isLiked={
                      video.likes.filter((like) => {
                        return like.user === cookies.get("userId");
                      }).length > 0
                    }
                    likes={video.likes.length}
                    setVideoPause={setVideoPause}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <Spinner />
        )}
        <Form formOpen={formOpen} setFormOpen={setFormOpen} />
      </div>
    </div>
  );
}

export default Home;
