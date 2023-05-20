import GuideCardPlaceholder from "../../components/placeholders/GuideCardPlaceholder";
import SliderPortion from "../../components/SliderPortion";

function GuidesPlaceholders() {
  const title = (
    <span className="placeholder bg-secondary col-4 col-sm-3 col-md-2 p-3 rounded" />
  );

  const cards = [
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

  return (
    <>
      <SliderPortion title={title} error={null} cards={cards} />
      <SliderPortion title={title} error={null} cards={cards} />
      <SliderPortion title={title} error={null} cards={cards} />
      <SliderPortion title={title} error={null} cards={cards} />
    </>
  );
}

export default GuidesPlaceholders;
