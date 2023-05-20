// components
import SliderPortion from "../../../components/SliderPortion";
import GuideCardPlaceholder from "../../../components/placeholders/GuideCardPlaceholder";

// apis
import GuideCard from "../../../components/GuideCard";
import { useSelector } from "react-redux";
import { useMemo } from "react";

function GuidesRow({ category }) {
  const { guides, status, error } = useSelector((state) => state.guides);
  const isLoading = status === "idle" || status === "pending";

  const title = category.name;

  const cards = useMemo(() => {
    if (isLoading)
      return [
        {
          card: <GuideCardPlaceholder />,
          id: 1,
        },
        {
          card: <GuideCardPlaceholder />,
          id: 2,
        },
        {
          card: <GuideCardPlaceholder />,
          id: 3,
        },
        {
          card: <GuideCardPlaceholder />,
          id: 4,
        },
        {
          card: <GuideCardPlaceholder />,
          id: 5,
        },
        {
          card: <GuideCardPlaceholder />,
          id: 6,
        },
      ];

    return guides
      .filter((guide) => guide.category.slug === category.slug)
      .slice(0, 6)
      .map((guide) => ({
        card: <GuideCard data={guide} />,
        id: guide._id,
      }));
  }, [isLoading]);

  let errorMessage = "";
  if (error) {
    errorMessage = error.httpCode
      ? error.httpCode + " - " + error.message
      : error.message;
  }

  if (cards.length === 0) return null;

  return (
    <SliderPortion
      title={title}
      to={`/guides/${category.slug}`}
      error={errorMessage}
      cards={cards}
    />
  );
}

export default GuidesRow;
