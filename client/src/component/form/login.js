import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import { object, string } from "yup";
import cookies from "js-cookie";
import { toast } from "react-toastify";
import styles from "./form.module.css";
function Login({ type, setType, setFormOpen, formOpen }) {
  function errorNotify(message) {
    toast.error(message, {
      toastId: "error1",
    });
  }
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: object({
      email: string()
        .email("Не корректный почтовый адресс ")
        .required("Заполните это поле"),
      password: string()
        .min(7, "Введите как минимум 7 символов")
        .required("Заполните это поле"),
    }),
    onSubmit: async (value, { resetForm }) => {
      const { data } = await axios.post("api/auth/login", value);
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
            Войти
          </button>
          <div className={styles.switchAuthType}>
            {type === "login" ? (
              <div>
                У вас нет аккаунта?,{" "}
                <span
                  className={styles.switchBtn}
                  onClick={() => {
                    setType("signup");
                  }}
                >
                  Зарегистрироваться
                </span>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
