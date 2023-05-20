import styles from "./BannerContainer.module.css";

function BannerContainer({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.banner}>{children}</div>
      </div>
    </div>
  );
}

export default BannerContainer;
