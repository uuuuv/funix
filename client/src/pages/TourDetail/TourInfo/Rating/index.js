import { useRef } from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import {
  star,
  starHalfFill,
  starFill,
  openQuotes,
} from "../../../../assets/svgs";
import useWindowReSize from "../../../../hooks/useResize";
import {
  SlickArrowLeft,
  SlickArrowRight,
} from "../../../../components/slickArrows";

import styles from "./Rating.module.css";
import "./TourRating.override.css";

// 3.5
const starsMap = (grade) => {
  return new Array(5).fill(1).map((_, index) => {
    const i = index + 1;
    if (i - 0.5 === grade) {
      return 0.5;
    }

    if (i <= grade) {
      return 1;
    }

    return 0;
  });
};

function Rating({ tour }) {
  const { t } = useTranslation();
  const sliderRef = useRef();

  const { width } = useWindowReSize();

  const settings = {
    speed: 500,
    infinite: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    adaptiveHeight: true,
    initialSlide: 0,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight slidesToShow={2} slidesToScroll={1} />,
    responsive: [
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          prevArrow: <SlickArrowLeft />,
          nextArrow: <SlickArrowRight slidesToShow={1} slidesToScroll={1} />,
        },
      },
    ],
  };

  let average =
    tour.rating.length > 0
      ? tour.rating.reduce((p, c) => p + c.stars, 0) / tour.rating.length
      : 0;

  if (average > Math.floor(average) && average <= Math.floor(average) + 0.5) {
    average = Math.floor(average) + 0.5;
  }

  if (average > Math.floor(average) + 0.5 && average <= Math.ceil(average)) {
    average = Math.ceil(average);
  }

  return (
    <div className={styles.wrapper + " tourDetail__rating"}>
      {tour.rating.length === 0 && (
        <p className="m-0">{t("pages.tour.details.rating.noReview")}</p>
      )}
      <div className={styles.inner + " pt-5"}>
        {tour.rating.length > 0 && (
          <Slider ref={sliderRef} {...settings}>
            <div
              className={
                styles.ratingItem +
                " d-flex align-items-center justify-content-center"
              }
            >
              <div className={styles.grade}>
                <h3 className={styles.average + " mb-1"}>
                  <strong>{average}</strong>
                  <span>/5</span>
                </h3>
                <div className="mb-1">
                  {starsMap(average).map((item, index) =>
                    item === 1 ? (
                      <span key={index}>{starFill}</span>
                    ) : item === 0.5 ? (
                      <span key={index}>{starHalfFill}</span>
                    ) : (
                      <span key={index}>{star}</span>
                    )
                  )}
                </div>
                <p>{t("pages.tour.details.rating.fromOurCurrentCustomers")}</p>
              </div>
            </div>

            {tour.rating.map((item, index) => (
              <div key={index} className={styles.ratingItem}>
                <div className={styles.comment + " p-4"}>
                  <p className={styles.quotes + " " + styles.openQuotes}>
                    {openQuotes}
                  </p>
                  <p className="m-0">{item.content}</p>
                  <p className={styles.quotes + " " + styles.closeQuotes}>
                    {openQuotes}
                  </p>
                  <h6>{item.name}</h6>
                </div>
              </div>
            ))}

            {width >= 576 && (
              <div
                className={
                  styles.ratingItem + " d-none d-sm-block " + styles.empty
                }
              />
            )}
          </Slider>
        )}
      </div>
    </div>
  );
}

export default Rating;
