export default ({ setFieldTouched, values }) => {
  // set fields touched vietnam version
  setFieldTouched("code", true, true);
  setFieldTouched("name", true, true);
  setFieldTouched("destinations", true, true);
  setFieldTouched("price", true, true);
  setFieldTouched("duration.days", true, true);
  setFieldTouched("duration.nights", true, true);
  setFieldTouched("departure_dates", true, true);
  setFieldTouched("departure_dates_text", true, true);
  setFieldTouched("start_at", true, true);
  setFieldTouched("start_at_text", true, true);
  setFieldTouched("description", true, true);
  setFieldTouched("journey", true, true);
  setFieldTouched("highlights", true, true);
  setFieldTouched("banner", true, true);
  setFieldTouched("thumb", true, true);
  setFieldTouched("terms.registration", true, true);
  setFieldTouched("terms.cancellation", true, true);
  setFieldTouched("terms.payment", true, true);
  setFieldTouched("terms.notes", true, true);
  setFieldTouched("price_policies.includes", true, true);
  setFieldTouched("price_policies.excludes", true, true);
  setFieldTouched("price_policies.other", true, true);

  // lộ trình
  setFieldTouched("itinerary", true, true);
  values.itinerary.forEach((iti, index) => {
    setFieldTouched(`itinerary[${index}].day`, true, true);
    setFieldTouched(`itinerary[${index}].destination`, true, true);
    setFieldTouched(`itinerary[${index}].content`, true, true);
    iti.images.forEach((_, imgIndex) => {
      setFieldTouched(
        `itinerary[${index}].images[${imgIndex}].caption`,
        true,
        true
      );
    });
  });

  // set fields touched english version
  setFieldTouched("en.name", true, true);
  setFieldTouched("en.journey", true, true);
  setFieldTouched("en.description", true, true);
  setFieldTouched("en.highlights", true, true);
  setFieldTouched("en.terms.cancellation", true, true);
  setFieldTouched("en.terms.registration", true, true);
  setFieldTouched("en.terms.payment", true, true);
  setFieldTouched("en.terms.notes", true, true);
  setFieldTouched("en.price_policies.includes", true, true);
  setFieldTouched("en.price_policies.excludes", true, true);
  setFieldTouched("en.price_policies.other", true, true);
  setFieldTouched("en.departure_dates_text", true, true);
  setFieldTouched("en.start_at_text", true, true);

  // lộ trình
  setFieldTouched("en.itinerary", true, true);
  values.en.itinerary.forEach((iti, index) => {
    setFieldTouched(`en.itinerary[${index}].day`, true, true);
    setFieldTouched(`en.itinerary[${index}].destination`, true, true);
    setFieldTouched(`en.itinerary[${index}].content`, true, true);
    iti.images.forEach((_, imgIndex) => {
      setFieldTouched(
        `en.itinerary[${index}].images[${imgIndex}].caption`,
        true,
        true
      );
    });
  });
};
