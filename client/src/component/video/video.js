import styles from "./video.module.css";
import { BsHeartFill } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import cookies from "js-cookie";
import axios from "axios";

const Video = React.forwardRef(
  ({ setFormOpen, src, likes, videoPause, isLiked, videoId }, ref) => {
    const [pause, setPause] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);

    function handlePauseClick() {
      ref.current.paused ? ref.current.play() : ref.current.pause();
      setPause((pause) => !pause);
    }

    async function handleLikeClick() {
      if (!cookies.get("token")) {
        return setFormOpen(true);
      }

      const { data } = await axios.post(
        "api/video/like",
        { videoId },
        {
          headers: {
            Authorization: cookies.get("token"),
          },
        }
      );

      setLikesCount((likes) => {
        let likesCount = likes;

        if (data.isLiked) {
          if (likesCount < 0) {
            return likesCount;
          }
          setLiked(false);
          return likesCount - 1;
        } else {
          setLiked(true);
          return likesCount + 1;
        }
      });
    }

    useEffect(() => {
      setLikesCount(likes);
      setLiked(isLiked);
    }, []);

    useEffect(() => {
      if (videoPause.state === "play") {
        ref.current.play();
      }

      setPause(false);
    }, [likes, ref, videoPause.state]);

    return (
      <>
        <div className={styles.clip}>
          <video
            onClick={handlePauseClick}
            ref={ref}
            autoPlay
            loop
            className={styles.video}
            playsInline
          >
            <source src={src} />
          </video>
          <div onClick={handleLikeClick} className={styles.heartIcon}>
            <BsHeartFill
              color={`${liked ? "#FB1254" : "#ffffff"}`}
              size={35}
              display="block"
            />
            <span>{likesCount}</span>
          </div>
          <div className={`${styles.playIcon} ${pause ? styles.show : ""}`}>
            <FaPlay size={50} />
          </div>
        </div>
      </>
    );
  }
);
export default Video;
