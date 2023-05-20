// main
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import TourCard from "../../components/TourCard";
import TourCardPlaceholder from "../../components/placeholders/TourCardPlaceholder";
import ErrorPage from "../../components/ErrorPage";
import ProductsListLayout from "../../layout/ProductsListLayout";
import ErrorBoundary from "../../components/ErrorBoundary";

// other
import usePageTitle from "../../hooks/usePageTitle";
import { useSelector } from "react-redux";
import ToursBanner from "../../containers/banners/ToursBanner";

function TourList({ category, basePath }) {
  const PAGE_SIZE = 8;
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const language = i18n.language;
  let { page } = useParams();
  if (!page) {
    page = 1;
  }

  page = parseInt(page);

  const prevCategory = useRef();

  const params = new URL(document.location).searchParams;

  const sort = params.get("sort") || "";

  const { status, error, euTours, vnTours } = useSelector(
    (state) => state.tours
  );

  const totalTours = useMemo(() => {
    let totalTours = [];
    if (category === "europe") {
      totalTours = euTours;
    }

    if (category === "vietnam") {
      totalTours = vnTours;
    }

    if (sort === "price-desc") {
      totalTours = [...totalTours].sort((a, b) => b.price - a.price);
    }

    if (sort === "price-asc") {
      totalTours = [...totalTours].sort((a, b) => a.price - b.price);
    }

    if (sort === "duration-desc") {
      totalTours = [...totalTours].sort(
        (a, b) => b.duration.days - a.duration.days
      );
    }

    if (sort === "duration-asc") {
      totalTours = [...totalTours].sort(
        (a, b) => a.duration.days - b.duration.days
      );
    }

    return totalTours;
  }, [category, sort, status]);

  const paginatedTours = totalTours.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const products = paginatedTours.map((tour) => ({
    component: <TourCard data={tour} />,
    id: tour._id,
  }));

  const pageCount = Math.ceil(totalTours.length / PAGE_SIZE);

  const title =
    category === "europe"
      ? t("pages.europeTravel.title")
      : t("pages.domesticTravel.title");

  const sortHandler = (e) => {
    // let path = `/${basePath}/${page}`;
    let path = `/${basePath}`;

    if (e.target.value) {
      path += `?sort=${e.target.value}`;
    }

    if (language !== "vi") {
      path = `/${language}${path}`;
    }

    navigate(path);
  };

  const changePageHandler = (num) => {
    let path = `/${basePath}/${num}`;

    if (sort) {
      path += `?sort=${sort}`;
    }

    if (language !== "vi") {
      path = `/${language}${path}`;
    }

    navigate(path);
  };

  usePageTitle(
    category === "europe"
      ? t("pages.europeTravel.title")
      : t("pages.domesticTravel.title")
  );

  useEffect(() => {
    if (prevCategory.current !== category) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      prevCategory.current = category;
    } else {
      window.scroll({
        top: 500,
        left: 0,
        behavior: "auto",
      });
    }
  }, [category, page]);

  // invalid page number
  if (isNaN(page) || page < 0 || (page > pageCount && pageCount >= 1)) {
    let path = `/${basePath}`;

    if (language !== "vi") {
      path = `/${language}/${basePath}`;
    }

    navigate(path);
  }

  return (
    <>
      {!error && !(status === "succeeded" && products.length === 0) && (
        <ErrorBoundary>
          <ToursBanner eu={(category = "europe")} vn={(category = "vietnam")} />
        </ErrorBoundary>
      )}

      {!error && (
        <ErrorBoundary>
          <ProductsListLayout
            title={title}
            pagination={{
              pageCount: pageCount,
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

export default TourList;
