import { Link } from "react-router-dom";
import styles from "./layout.module.css";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { MdOutlineAdd } from "react-icons/md";

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <div className={styles.window}>
        <div className={styles.main}>{children}</div>
        <div className={styles.footer}>
          <nav className={styles.menu}>
            <li className={styles.item}>
              <Link to="/">
                <div className={styles.item__link}>
                  <AiFillHome size={20} />
                  <p>Главная</p>
                </div>
              </Link>
            </li>

            <li className={styles.item}>
              <Link to="/new">
                <div className={styles.item__link}>
                  <div className={styles.add}>
                    <MdOutlineAdd color="#000" size={30} />
                  </div>
                </div>
              </Link>
            </li>

            <li className={styles.item}>
              <Link to="/profile">
                <div className={styles.item__link}>
                  <AiOutlineUser size={20} />
                  <p>Профиль</p>
                </div>
              </Link>
            </li>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Layout;
