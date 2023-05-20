import { useRef } from "react";
import {
  isSameDate,
  stringToDate,
} from "../../../../services/helpers/dateHandler";
import DateItem from "./DateItem";

function DepartureDates({ formik }) {
  const inputRef = useRef();

  const { values, setFieldValue } = formik;

  const keydownHandler = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      return false;
    }
  };

  const addDateHandler = () => {
    const [err, newDate] = stringToDate(inputRef.current.value); // timestamp
    if (!err) {
      if (values.departure_dates.includes(newDate)) {
        alert("Bạn đã chọn ngày này");
        return;
      }

      if (newDate <= Date.now()) {
        alert("Phải lớn hơn ngày hiện tại");
        return;
      }

      setFieldValue("departure_dates", [...values.departure_dates, newDate]);
      inputRef.current.value = "";
    }
  };

  const keyupHandler = (e) => {
    if (e.code === "Enter") {
      addDateHandler();
    }
  };

  const removeDateHandler = (removedDate) => {
    setFieldValue(
      "departure_dates",
      values.departure_dates.filter(
        (timestamp) => !isSameDate(new Date(removedDate), new Date(timestamp))
      ),
      false
    );
  };

  return (
    <div>
      <h6 className="mb-1">Ngày cụ thể</h6>
      <div className="d-flex border-end pe-2">
        <input
          ref={inputRef}
          className="p-2 w-100"
          type="text"
          name="todo"
          placeholder="ddmmyy"
          onKeyDown={keydownHandler}
          onKeyUp={keyupHandler}
        />
        <button
          type="button"
          className="ms-2 p-2 border"
          onClick={addDateHandler}
        >
          Thêm
        </button>
      </div>

      <div className="d-flex flex-wrap">
        {values.departure_dates.map((item) => (
          <DateItem
            key={item}
            timestamp={item}
            onRemoveDate={removeDateHandler}
          />
        ))}
      </div>
    </div>
  );
}

export default DepartureDates;
