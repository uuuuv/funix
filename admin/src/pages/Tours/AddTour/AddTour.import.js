// main
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

// components
import SpinnerModal from "../../../components/SpinnerModal";
import TourForm from "../TourForm";
import NotifyModal from "../../../components/NotifyModal";
import TopBar from "../../../components/TopBar";

// other
import usePageTitle from "../../../hooks/usePageTitle";
import { addTour, resetToursState } from "../../../store/tours.slice";
import DELTA from "../../../services/helpers/quill/emptyDelta";

const initialValues = {
  destinations: [],

  code: "",
  slug: "",
  name: "",
  journey: "",
  description: "",
  highlights: DELTA,
  start_at: "",
  start_at_text: "",

  price: "",
  duration: {
    days: "1",
    nights: "0",
  },

  departure_dates: [],
  departure_dates_text: "",

  price_policies: {
    includes: DELTA,
    excludes: DELTA,
    other: DELTA,
  },

  terms: {
    registration: DELTA,
    cancellation: DELTA,
    payment: DELTA,
    notes: DELTA,
  },

  thumb: "",
  banner: "",

  itinerary: [
    {
      id: uuid(),
      images: [],
      day: "",
      destination: "",
      content: DELTA,
    },
  ],
  rating: [],

  en: {
    name: "",
    journey: "",
    description: "",
    highlights: DELTA,
    start_at_text: "",
    departure_dates_text: "",

    price_policies: {
      includes: DELTA,
      excludes: DELTA,
      other: DELTA,
    },

    terms: {
      registration: DELTA,
      cancellation: DELTA,
      payment: DELTA,
      notes: DELTA,
    },

    itinerary: [
      {
        id: uuid(),
        images: [],
        day: "",
        destination: "",
        content: DELTA,
      },
    ],
  },
};

const dataPacker = (values) => {
  const formData = new FormData();
  formData.append("code", values.code.toLowerCase());
  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("journey", values.journey);
  formData.append("description", values.description);
  formData.append("highlights", JSON.stringify(values.highlights));
  formData.append("price", values.price);
  formData.append("destinations", JSON.stringify(values.destinations));
  formData.append("departure_dates", JSON.stringify(values.departure_dates));
  formData.append("departure_dates_text", values.departure_dates_text);
  formData.append("duration", JSON.stringify(values.duration));
  formData.append("start_at", values.start_at);
  formData.append("start_at_text", values.start_at_text);
  const itinerary = values.itinerary.map((item) => ({
    id: item.id,
    day: item.day,
    destination: item.destination,
    content: item.content,
    images: item.images.map((imgItem) => ({
      ...imgItem,
      url: typeof imgItem.url === "string" ? imgItem.url : null,
    })),
  }));
  formData.append("itinerary", JSON.stringify(itinerary));
  formData.append("terms", JSON.stringify(values.terms));
  formData.append("price_policies", JSON.stringify(values.price_policies));
  const rating = values.rating.map((item) => ({
    name: item.name,
    stars: item.stars,
    content: item.content,
  }));
  formData.append("rating", JSON.stringify(rating));
  formData.append("en", JSON.stringify(values.en));

  // images
  formData.append("thumb", values.thumb);
  formData.append("banner", values.banner);

  // itinerary images
  const itineraryImages = [];
  values.itinerary.forEach((iti) => {
    iti.images.forEach((imgItem) => {
      if (typeof imgItem.url !== "string") {
        const originalName = imgItem.url.name;
        const extension = originalName.slice(originalName.lastIndexOf("."));
        const fileName = imgItem.caption + extension;

        itineraryImages.push({
          id: imgItem.id,
          fileName: fileName,
          file: imgItem.url,
        });
      }
    });
  });

  itineraryImages.forEach((item) => {
    formData.append(
      "itineraryImages",
      item.file,
      `${item.id}-joyadivider-${item.fileName}`
    );
  });

  return formData;
};

export {
  // main
  useRef,
  useDispatch,
  useSelector,

  // components
  SpinnerModal,
  TourForm,
  NotifyModal,
  TopBar,

  // other
  usePageTitle,
  initialValues,
  dataPacker,
  addTour,
  resetToursState,
};
