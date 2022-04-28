import styles from "../page-styles/profile.module.css";

import { useEffect, useState } from "react";
import cookies from "js-cookie";
import Form from "../component/form/form";
import axios from "axios";
import Spinner from "../component/spinner/spinner";
function Profile() {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState(null);
  const [media, setMedia] = useState(null);
  const [videoCount, setVideoCount] = useState(null);
  useEffect(() => {
    if (!cookies.get("token")) {
      return setFormOpen(true);
    }
    async function getUserInfo() {
      const { data } = await axios.get("/api/auth/getUser", {
        headers: {
          Authorization: cookies.get("token"),
        },
      });
      setName(data.name);
      setMedia(data.photo);
      setVideoCount(data.videoCount);
    }
    getUserInfo();
  }, []);

  if (!cookies.get("token")) {
    return (
      <div className={styles.profile}>
        <Form formOpen={formOpen} setFormOpen={setFormOpen} />
      </div>
    );
  }
  return (
    <div className={styles.profile}>
      {videoCount === 0 ? (
        <>
          <div className={styles.top}>
            <div className={styles.logo}>
              <img src={media} alt="logo" />
            </div>
            <div className={styles.name}>{name}</div>
          </div>
          <div className={styles.count}>Вы загрузили {videoCount} видео</div>
        </>
      ) : (
        <Spinner />
      )}

      <Form formOpen={formOpen} setFormOpen={setFormOpen} />
    </div>
  );
}

export default Profile;
