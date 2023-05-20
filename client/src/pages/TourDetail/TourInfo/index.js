import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useTranslation } from "react-i18next";

import Overview from "./Overview";
import DropdownItems from "./DropdownItems";
import Itinerary from "./Itinerary";
import Rating from "./Rating";
import Placeholder from "../../../components/placeholders/Placeholder";

import styles from "./TourInfo.module.css";
import "./TourInfo.override.css";

const TourInfo = ({ tour, isLoading }) => {
  const { t } = useTranslation();

  const pricePolicies = tour
    ? [
        {
          id: "includes",
          title: t("pages.tour.details.pricePolicy.includes"),
          content: tour.price_policies.includes,
        },
        {
          id: "excludes",
          title: t("pages.tour.details.pricePolicy.excludes"),
          content: tour.price_policies.excludes,
        },
        {
          id: "other",
          title: t("pages.tour.details.pricePolicy.childrenAndOther"),
          content: tour.price_policies.other,
        },
      ]
    : [];

  const terms = tour
    ? [
        {
          id: "registration",
          title: t("pages.tour.details.terms.registration"),
          content: tour.terms.registration,
        },
        {
          id: "cancellation",
          title: t("pages.tour.details.terms.cancellation"),
          content: tour.terms.cancellation,
        },
        {
          id: "payment",
          title: t("pages.tour.details.terms.paymentMethods"),
          content: tour.terms.payment,
        },
        {
          id: "notes",
          title: t("pages.tour.details.terms.notes"),
          content: tour.terms.notes,
        },
      ]
    : [];

  const itinerary = tour ? tour.itinerary : [];

  return (
    <div className={styles.tourInfo + " tourInfo"}>
      {isLoading && (
        <div className={styles.placeholder}>
          <div className={styles.tabs}>
            <Placeholder col={12} height={38} rounded />
          </div>
          <div className="mt-1">
            <Placeholder col={12} height={300} rounded />
          </div>
        </div>
      )}

      {tour && !isLoading && (
        <Tabs
          defaultActiveKey="overview"
          className={styles.tabs + " mb-0 borderbottom---"}
        >
          <Tab
            eventKey="overview"
            title={t("pages.tour.details.overview.title").toUpperCase()}
          >
            <div className="p-3 border-start border-end border-bottom rounded-0 ">
              {tour && <Overview tour={tour} />}
            </div>
          </Tab>
          <Tab
            eventKey="itinerary"
            title={t("pages.tour.details.itinerary.title").toUpperCase()}
          >
            <div className="p-3 border-start border-end border-bottom rounded-0">
              <Itinerary data={itinerary} />
            </div>
          </Tab>
          <Tab
            eventKey="price"
            title={t("pages.tour.details.pricePolicy.title").toUpperCase()}
          >
            <div className="p-3 border-start border-end border-bottom rounded-0">
              <DropdownItems data={pricePolicies} />
            </div>
          </Tab>

          <Tab
            eventKey="terms"
            title={t("pages.tour.details.terms.title").toUpperCase()}
          >
            <div className="p-3 border-start border-end border-bottom rounded-0">
              <DropdownItems data={terms} />
            </div>
          </Tab>
          <Tab
            eventKey="rating"
            title={t("pages.tour.details.rating.title").toUpperCase()}
          >
            <div className="p-3 border-start border-end border-bottom rounded-0">
              {tour && <Rating tour={tour} />}
            </div>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default TourInfo;
