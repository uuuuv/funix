import { memo } from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import BannerSliderItem from "./BannerSliderItem";
import BannerContainer from "../bannerComponents/BannerContainer";
import BannerError from "../bannerComponents/BannerError";
import BannerPending from "../bannerComponents/BannerPending";
import { SlickArrowLeft, SlickArrowRight } from "../../slickArrows";
import "./BannerCarousel.override.css";
import FadedAnimation from "../../FadedAnimation";

function BannerCarousel({ carouselItems, isLoading, error, basePath }) {
  const { t } = useTranslation();

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2500,
    prevArrow: <SlickArrowLeft infinite />,
    nextArrow: <SlickArrowRight slidesToShow={1} slidesToScroll={1} infinite />,
  };

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

  if (!error && !isLoading && carouselItems.length > 0) {
    content = (
      <Slider {...settings}>
        {carouselItems.map((item) => (
          <BannerSliderItem
            key={item._id}
            to={`${basePath}/${item.slug}`}
            image={item.banner}
            alt={item.name || item.title}
          />
        ))}
      </Slider>
    );
  }

  if (!error && !isLoading && carouselItems.length === 0) {
    content = (
      <p className="text-light text-center mt-5 pt-5">{t("general.noTours")}</p>
    );
  }

  return (
    <FadedAnimation>
      <div className="bannerCarousel">
        <BannerContainer>{content}</BannerContainer>
      </div>
    </FadedAnimation>
  );
}

export default memo(BannerCarousel);
