import styles from "./spinner.module.css";
function Spinner() {
  return (
    <div className={styles.loader}>
      <div className={styles.cyan}></div>
      <div className={styles.magenta}></div>
    </div>
  );
}

export default Spinner;
