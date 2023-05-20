import {
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
} from "./AddTour.import";
import { useState } from "react";

function AddTour() {
  const [formKey, setFormKey] = useState(1);
  const submitRef = useRef();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.tours);

  const submitHandler = (values) => {
    const formData = dataPacker(values);
    dispatch(addTour(formData));
  };

  const submitTrigger = () => {
    if (submitRef.current) {
      submitRef.current.click();
    }
  };

  let notify = {};
  if (status.addTour === "succeeded") {
    notify = {
      type: "success",
      show: status.addTour === "succeeded",
      message: "Tạo tour mới thành công.",
      btn: {
        component: "button",
        cb: () => {
          setFormKey((prev) => prev + 1);
          dispatch(resetToursState("addTour"));
        },
      },
    };
  }

  if (error.addTour) {
    notify = {
      type: "error",
      show: Boolean(error.addTour),
      message: error.addTour.message,
      btn: {
        component: "button",
        cb: () => {
          dispatch(resetToursState("addTour"));
        },
      },
    };
  }

  usePageTitle("Tạo tour mới");

  return (
    <>
      <SpinnerModal show={status.addTour === "pending"} />
      <NotifyModal {...notify} />

      <TopBar title="Tạo tour mới">
        {status.fetchTours === "succeeded" && (
          <button
            type="button"
            onClick={submitTrigger}
            className="btn btn-primary "
          >
            Lưu
          </button>
        )}
      </TopBar>

      <div className="p-2">
        {status.fetchTours === "succeeded" && (
          <TourForm
            key={formKey}
            ref={submitRef}
            initialValues={initialValues}
            onSubmit={submitHandler}
          />
        )}

        {error.fetchTours && (
          <div className="p-2 rounded bg-light shadow">
            <p className="text-danger m-0">{error.fetchTours.message}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default AddTour;
