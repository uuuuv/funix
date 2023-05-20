// main
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";

// components
import TourCard from "../../components/TourCard";
import TourCardPlaceholder from "../../components/placeholders/TourCardPlaceholder";
import ErrorPage from "../../components/ErrorPage";
import ProductsListLayout from "../../layout/ProductsListLayout";
import ErrorBoundary from "../../components/ErrorBoundary";
import useSearchTour from "../../hooks/useSearchTour";
import ToursBanner from "../../containers/banners/ToursBanner";

// apis
import { useSelector } from "react-redux";

import SearchBar from "./SearchBar";
import { useEffect } from "react";

const PAGE_SIZE = 8;

function TourSearching() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const location = useLocation();

  // lấy params
  const params = new URL(document.location).searchParams;
  const sort = params.get("sort") || "";
  const searchTerm = params.get("search") || "";
  let { place, page, placeOrPage } = useParams();

  if (placeOrPage) {
    if (!isNaN(Number(placeOrPage)) && Number.isInteger(Number(placeOrPage))) {
      page = Number(placeOrPage);
    } else {
      place = placeOrPage;
    }
  }

  if (!page) {
    page = 1;
  }

  const { status, error } = useSelector((state) => state.tours);

  // lọc tours
  let total_tours = useSearchTour(searchTerm);
  let placeName = place;
  const destinationMatches = (dest) => {
    // nước
    if (dest.country?.slug === place) return dest.country.name;
    if (dest.type === "country" && dest.slug === place) return dest.name;

    // tỉnh
    if (dest.province?.slug === place) return dest.province.name;
    if (dest.type === "province" && dest.slug === place) return dest.name;

    // thành phố thuộc trung ương
    if (!dest.province && dest.type === "city" && dest.slug === place)
      return dest.name;
    if (!dest.province && dest.city?.slug === place) return dest.city.name;

    return false;
  };

  if (place) {
    total_tours = total_tours.filter((tour) =>
      tour.destinations.some((dest) => {
        const nameMatches = destinationMatches(dest);
        if (nameMatches) {
          placeName = nameMatches;
          return true;
        }
        return false;
      })
    );
  }

  const sortHandler = (e) => {
    let path = location.pathname;

    if (searchTerm) {
      path += `?search=${searchTerm}`;
      if (e.target.value) {
        path += `&sort=${e.target.value}`;
      }
    } else {
      if (e.target.value) {
        path += `?sort=${e.target.value}`;
      }
    }

    navigate(path);
  };

  const changePageHandler = (num) => {
    let path = "";
    if (place) {
      path = `/du-lich/tim-kiem/${place}/${num}`;
    } else {
      path = `/du-lich/tim-kiem/${num}/`;
    }

    if (searchTerm) {
      path += `?search=${searchTerm}`;
      if (sort) {
        path += `&sort=${sort}`;
      }
    } else {
      if (sort) {
        path += `?sort=${sort}`;
      }
    }

    if (lang === "vi") return navigate(path);
    navigate(`/${lang}${path}`);
  };

  let tours = total_tours.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  if (sort === "") {
    tours = tours.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  if (sort === "price-desc") {
    tours = tours.sort((a, b) => b.price - a.price);
  }

  if (sort === "price-asc") {
    tours = tours.sort((a, b) => a.price - b.price);
  }

  if (sort === "duration-asc") {
    tours = tours.sort((a, b) => b.duration.days - a.duration.days);
  }

  if (sort === "duration-asc") {
    tours = tours.sort((a, b) => a.duration.days - b.duration.days);
  }

  const products = tours.map((tour) => ({
    component: <TourCard data={tour} />,
    id: tour._id,
  }));

  const page_count = Math.ceil(total_tours.length / PAGE_SIZE);

  // ********** side effects *************
  let title = lang === "vi" ? "Tìm kiếm tour" : "Search for tours";

  if (place) {
    title =
      lang === "en"
        ? `Tours list for ${placeName}`
        : `Danh sách tour ${placeName}`;
  }

  if (searchTerm) {
    title += `: "${searchTerm}"`;
  }

  usePageTitle(title);
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location]);

  return (
    <>
      <ToursBanner eu vi />

      <div className="text-center py-3"></div>

      {status !== "failed" && (
        <div className="mt-4">
          <SearchBar />
        </div>
      )}

      {!error && (
        <ErrorBoundary>
          <ProductsListLayout
            title={title}
            pagination={{
              pageCount: page_count,
              currentPage: Number(page),
              changePageHandler: changePageHandler,
            }}
            products={products}
            onSort={sortHandler}
            placeholder={<TourCardPlaceholder />}
            status={status}
            sort={sort}
          />
        </ErrorBoundary>
      )}

      {error && <ErrorPage code={error.httpCode} message={error.message} />}
    </>
  );
}

export default TourSearching;
