import { useSelector } from "react-redux";
import { useMemo } from "react";
import BannerCarousel from "../../../components/banners/BannerCarousel";

function ToursBanner({ eu, vn }) {
  const { vnTours, euTours, status, error } = useSelector(
    (state) => state.tours
  );

  let carouselItems = useMemo(() => {
    let hotVnTours = vnTours.filter((tour) => tour.hot).slice(0, 6);
    if (hotVnTours.length === 0) {
      hotVnTours = vnTours.slice(0, 6);
    }

    let hotEuTours = euTours.filter((tour) => tour.hot).slice(0, 6);
    if (hotEuTours.length === 0) {
      hotEuTours = euTours.slice(0, 6);
    }

    let results = [];
    if (eu) {
      results = [...results, ...hotEuTours];
    }

    if (vn) {
      results = [...results, ...hotVnTours];
    }

    return results;
  }, [status]);

  return (
    <BannerCarousel
      carouselItems={carouselItems}
      isLoading={status === "idle" || status === "pending"}
      error={error}
      basePath={"/du-lich"}
    />
  );
}

export default ToursBanner;
