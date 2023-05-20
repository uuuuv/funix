import { memo } from "react";
import BannerContainer from "../bannerComponents/BannerContainer";
import BannerError from "../bannerComponents/BannerError";
import BannerPending from "../bannerComponents/BannerPending";
import styles from "./BannerImage.module.css";

function BannerImage({ isLoading, error, image, alt }) {
  let content = <BannerPending />;

  if (error) {
    let errorMessage = "";

    if (error.httpCode) {
      errorMessage = error.httpCode + " - " + error.message;
    }

    if (!error.httpCode) {
      errorMessage = error.message;
    }

    content = <BannerError msg={errorMessage} />;
  }

  if (!isLoading && !error && image) {
    content = (
      <div className="w-100 h-100">
        <img
          className={styles.bannerImage}
          src={image}
          alt={alt}
          onError={(e) =>
            e.target.classList.add(" bg-secondary text-light " + styles.error)
          }
        />
      </div>
    );
  }

  return <BannerContainer>{content}</BannerContainer>;
}

export default memo(BannerImage);
