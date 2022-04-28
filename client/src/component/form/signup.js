import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { mixed, object, string } from "yup";
import cookies from "js-cookie";
import styles from "./form.module.css";
import { BiUser } from "react-icons/bi";
import { toast } from "react-toastify";
function SignUp({ type, setType, setFormOpen, formOpen }) {
  const inputRef = useRef(null);
  const [media, setMedia] = useState(null);
  const [file, setFile] = useState(null);

  function errorNotify(message) {
    toast.error(message, {
      toastId: "error1",
    });
  }
  const formik = useFormik({
    initialValues: {
      photo: "",
      name: "",
      email: "",
      password: "",
    },
    validationSchema: object({
      photo: mixed().required("Выберите изображение"),

      name: string().required("Заполните это поле"),
      email: string()
        .email("Не корректный почтовый адресс ")
        .required("Заполните это поле"),
      password: string()
        .min(7, "Введите как минимум 7 символов")
        .required("Заполните это поле"),
    }),
    onSubmit: async (value, { resetForm }) => {
      const imageData = new FormData();
      
      imageData.append("file", file[0]);
      imageData.append("upload_preset", "user_image");
      imageData.append("cloud_name", "shop-ai");
      const image = await axios.post(
        "https://api.cloudinary.com/v1_1/shop-ai/upload",
        imageData
      );

      const { data } = await axios.post("api/auth/signup", {
        email: value.email,
        password: value.password,
        name: value.name,
        photo: image.data.url,
      });

      if (data.error) {
        return errorNotify(data.message);
      }

      cookies.set("token", data.token);
      cookies.set("userId", data.user.id);

      resetForm();
      setFormOpen(false);
      window.location.reload(false);
    },
  });

  function handleChange(e) {
    const files = e.currentTarget.files;
    console.log(files);
    setMedia(URL.createObjectURL(files[0]));
    setFile(files);
  }

  useEffect(() => {
    if (!formOpen) {
      formik.resetForm();
    }
  }, [formOpen, formik]);

  return (
    <div
      className={`${styles.backface} ${formOpen ? styles.show : ""}`}
      id="form"
    >
      <div className={`${styles.formWrapper} ${formOpen ? styles.active : ""}`}>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div>
            <div
              className={styles.userPhoto}
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              {media ? (
                <div className={styles.logo}>
                  <img src={media} alt="logo" />
                </div>
              ) : (
                <div
                  className={`${styles.dummyLogo} ${
                    formik.touched.photo && formik.errors.photo
                      ? styles.errorBorderRed
                      : ""
                  }`}
                >
                  <BiUser color="#d6d6d6" size={40} />
                </div>
              )}
            </div>

            <input
              onChange={(e) => {
                handleChange(e);
                formik.handleChange(e);
              }}
              value={formik.values.photo}
              name="photo"
              ref={inputRef}
              style={{ display: "none" }}
              type="file"
            />

            {formik.touched.photo && formik.errors.photo ? (
              <div className={styles.error}>{formik.errors.photo}</div>
            ) : null}
          </div>
          <div>
            <input
              onChange={formik.handleChange}
              value={formik.values.name}
              name="name"
              placeholder="Ник"
              onBlur={formik.handleBlur}
              className={styles.input}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className={styles.error}>{formik.errors.name}</div>
            ) : null}
          </div>
          <div>
            <input
              onChange={formik.handleChange}
              value={formik.values.email}
              name="email"
              className={styles.input}
              placeholder="Почта"
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className={styles.input}
              onBlur={formik.handleBlur}
              placeholder="Пароль"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.error}>{formik.errors.password}</div>
            ) : null}
          </div>
          <button className={styles.btn} type="submit">
            Авторизоваться
          </button>
          <div className={styles.switchAuthType}>
            {type === "signup" ? (
              <div>
                У вас есть аккаунт?,{" "}
                <span
                  className={styles.switchBtn}
                  onClick={() => {
                    setType("login");
                  }}
                >
                  Войдите
                </span>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
