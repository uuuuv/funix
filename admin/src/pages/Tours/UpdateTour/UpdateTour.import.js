// main
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

// components
import SpinnerModal from "../../../components/SpinnerModal";
import ErrorMessage from "../../../components/ErrorMessage";
import TourForm from "../TourForm";
import NotifyModal from "../../../components/NotifyModal";
import TopBar from "../../../components/TopBar";

// apis
import useAxios from "../../../hooks/useAxios";
import { addNewTour, fetchCats } from "../../../services/apis";

// other
import usePageTitle from "../../../hooks/usePageTitle";

// css
import styles from "./UpdateTour.module.css";

const dataPacker = (values) => {
  console.log(values._id);
  const itinerary = values.itinerary.map((item) => ({
    id: item.id,
    day: item.day,
    destination: item.destination,
    content: item.content,
    images: item.images.map((imgItem) => ({
      ...imgItem,
      url: typeof imgItem.url === "string" ? imgItem.url : "",
    })),
  }));

  const rating = values.rating.map((item) => ({
    name: item.name,
    stars: item.stars,
    content: item.content,
  }));

  const destinations = values.destinations;

  const formData = new FormData();

  const j = (data) => JSON.stringify(data);
  console.log(values);

  formData.append("_id", values._id);
  formData.append("code", values.code.toLowerCase());
  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("hot", values.hot);
  formData.append("journey", values.journey);
  formData.append("description", values.description);
  formData.append("highlights", j(values.highlights));
  formData.append("price", values.price);
  formData.append("destinations", j(destinations));
  formData.append("departure_dates", j(values.departure_dates));
  formData.append("departure_dates_text", values.departure_dates_text);
  formData.append("duration", j(values.duration));
  formData.append("itinerary", j(itinerary));
  formData.append("terms", j(values.terms));
  formData.append("price_policies", j(values.price_policies));
  formData.append("rating", j(rating));
  formData.append("en", j(values.en));
  formData.append("thumb", values.thumb);
  formData.append("banner", values.banner);
  formData.append("start_at", values.start_at);
  formData.append("start_at_text", values.start_at_text);

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
  useState,
  useRef,
  useEffect,
  useParams,
  useNavigate,
  Link,

  // components
  SpinnerModal,
  NotifyModal,
  TourForm,
  ErrorMessage,
  TopBar,

  // other
  useAxios,
  addNewTour,
  fetchCats,
  usePageTitle,
  dataPacker,
  styles,
};
