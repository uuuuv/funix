// main
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// components
import BannerCarousel from "../../components/banners/BannerCarousel";
import Container from "../../components/Container";
import GuidesRow from "./GuidesRow";
import ErrorPage from "../../components/ErrorPage";
import GuidesPlaceholders from "./GuidesPlaceholders";

// other
import usePageTitle from "../../hooks/usePageTitle";
import useScroll from "../../hooks/useScroll";
import { selectGuidesCategory } from "../../store/guides.slice";

function Guides() {
  const { t, i18n } = useTranslation();
  const { guides, status, error } = useSelector((state) => state.guides);
  const isLoading = status === "idle" || status === "pending";
  const category = useSelector(selectGuidesCategory);
  useScroll();
  usePageTitle(t("pages.guides.title"));

  if (error) return <ErrorPage code={error.httpCode} message={error.message} />;

  let noGuides = "Không có bài viết nào";
  if (i18n.language === "en") noGuides = "No guides";
  return (
    <>
      {!(status === "succeeded" && category.length === 0) && (
        <BannerCarousel
          carouselItems={guides.slice(0, 3)}
          isLoading={isLoading}
          error={error}
          basePath={"/guides/bai-viet"}
        />
      )}
      <Container>
        <div className="pt-5">
          {category.map((item) => (
            <GuidesRow key={item._id} category={item} />
          ))}

          {status === "succeeded" && category.length === 0 && (
            <p className="text-center">{noGuides}</p>
          )}

          {isLoading && <GuidesPlaceholders />}
        </div>
      </Container>
    </>
  );
}

export default Guides;
