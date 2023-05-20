// main
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// components
import GuideCard from "../../components/GuideCard";
import GuideCardPlaceholder from "../../components/placeholders/GuideCardPlaceholder";
import ProductsListLayout from "../../layout/ProductsListLayout";
import ErrorPage from "../../components/ErrorPage";
import NotFound from "../../pages/NotFound";

// other
import usePageTitle from "../../hooks/usePageTitle";
import useScroll from "../../hooks/useScroll";
import BannerCarousel from "../../components/banners/BannerCarousel";

const PAGE_SIZE = 12;

function GuidesCategory() {
  const navigate = useNavigate();
  const language = useTranslation().i18n.language;
  let { slug, page } = useParams();
  if (!page) {
    page = 1;
  }

  page = parseInt(page);

  let { guides, status, error } = useSelector((state) => state.guides);

  const category = useMemo(() => {
    return Array.from(
      new Set(guides.map((item) => JSON.stringify(item.category)))
    ).map((item) => JSON.parse(item));
  }, [guides]);

  const categoryItem = category.find((item) => item.slug === slug);

  const notFound = status === "succeeded" && !categoryItem;
  const isLoading = status === "idle" || status === "pending";

  let documentTitle = !notFound && categoryItem ? categoryItem.name : "";
  usePageTitle(documentTitle);
  useScroll({
    reScroll: { top: 500 },
    dependencies: [page],
  });

  if (notFound) {
    return <NotFound />;
  }

  const categoriedGuides = guides.filter(
    (guide) => guide.category.slug === slug
  );

  const pageCount = Math.ceil(categoriedGuides.length / PAGE_SIZE);

  if (isNaN(page) || page < 0 || (page > pageCount && pageCount >= 1)) {
    let path = `/guides/${slug}`;

    if (language !== "vi") {
      path = `/${language}${path}`;
    }

    navigate(path);
  }

  const changePageHandler = (num) => {
    let path = `/guides/${slug}/${num}`;

    if (language !== "vi") {
      path = `/${language}${path}`;
    }

    navigate(path);
  };

  const products = categoriedGuides.map((guide) => ({
    component: <GuideCard data={guide} />,
    id: guide.slug,
  }));

  const filteredProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  if (error) return <ErrorPage code={error.httpCode} message={error.message} />;

  if (notFound) return <NotFound />;

  return (
    <>
      <BannerCarousel
        carouselItems={categoriedGuides.slice(0, 3)}
        isLoading={isLoading}
        error={error}
        basePath={"/guides/bai-viet"}
      />

      <ProductsListLayout
        title={categoryItem?.name}
        pagination={{
          pageCount: pageCount,
          currentPage: Number(page),
          changePageHandler: changePageHandler,
        }}
        products={filteredProducts}
        placeholder={<GuideCardPlaceholder />}
        isLoading={isLoading}
        status={status}
      />
    </>
  );
}

export default GuidesCategory;
