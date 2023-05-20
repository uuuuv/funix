// main
import HotToursTab from "./HotToursTab";
import { useState, useEffect } from "react";
import TopBar from "../../../components/TopBar";
import SpinnerModal from "../../../components/SpinnerModal";
import NotifyModal from "../../../components/NotifyModal";
import { useDispatch, useSelector } from "react-redux";
import {
  updateHotTours,
  fetchTours,
  selectTours,
  resetToursState,
} from "../../../store/tours.slice";
import { selectIsAdmin } from "../../../store/user.slice";

function HotToursManager() {
  const { tours, status, error } = useSelector(selectTours);
  const isAdmin = useSelector(selectIsAdmin);

  const [chosenTours, setChosenTours] = useState([]);
  const dispatch = useDispatch();

  const vnTours = tours.filter((tour) =>
    tour.destinations.every((dest) => dest.region)
  );

  const euTours = tours.filter((tour) =>
    tour.destinations.some((dest) => dest.continent === "chau-au")
  );

  const remainEUTours = euTours.filter(
    (tour) => !chosenTours.some((item) => item.code === tour.code)
  );

  const remainVNTours = vnTours.filter(
    (tour) => !chosenTours.some((item) => item.code === tour.code)
  );

  const chosenEUTours = chosenTours.filter((tour) =>
    tour.destinations.some((dest) => dest.continent === "chau-au")
  );

  const chosenVNTours = chosenTours.filter((tour) =>
    tour.destinations.every((dest) => dest.region)
  );

  const addTour = (tour) => {
    setChosenTours((prev) => [...prev, tour]);
  };

  const removeTour = (tour) => {
    setChosenTours((prev) => prev.filter((item) => item._id !== tour._id));
  };

  const submitHandler = () => {
    dispatch(updateHotTours(chosenTours.map((tour) => tour._id)));
  };

  useEffect(() => {
    setChosenTours(tours.filter((tour) => tour.hot));
  }, [tours]);

  // notification
  let notify = {};
  if (status.updateHotTours === "succeeded") {
    notify = {
      show: status.updateHotTours === "succeeded",
      type: "success",
      message: "Cập nhật tour nổi bật thành công",
      btn: {
        component: "button",
        text: "OK",
        cb: () => {
          dispatch(resetToursState("updateHotTours"));
        },
      },
    };
  }

  if (error.updateHotTours) {
    notify = {
      show: Boolean(error.updateHotTours),
      type: "error",
      message: error.updateHotTours.message,
      btn: {
        component: "button",
        text: "OK",
        cb: () => {
          dispatch(fetchTours());
        },
      },
    };
  }
  return (
    <>
      <SpinnerModal show={status.updateHotTours === "pending"} />
      <NotifyModal {...notify} />
      <TopBar title="Quản lý tour nổi bật">
        {status.fetchTours === "succeeded" && isAdmin && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={submitHandler}
          >
            Lưu
          </button>
        )}
      </TopBar>

      <div className="p-2">
        <div className="p-2 rounded shadow bg-light">
          {status.fetchTours === "succeeded" && (
            <div className="border">
              <div className="row m-0">
                <div className="col-12 col-md-6 border-end">
                  <HotToursTab
                    title="Tour châu Âu"
                    remainTours={remainEUTours}
                    chosenTours={chosenEUTours}
                    addTour={addTour}
                    removeTour={removeTour}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <HotToursTab
                    title="Tour trong nước"
                    remainTours={remainVNTours}
                    chosenTours={chosenVNTours}
                    addTour={addTour}
                    removeTour={removeTour}
                  />
                </div>
              </div>
            </div>
          )}

          {error.fetchTours && (
            <p className="text-danger m-0">{error.fetchTours.message}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default HotToursManager;
