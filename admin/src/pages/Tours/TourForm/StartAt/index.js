import { useState, useCallback } from "react";
import RedAsterisk from "../../../../../components/RedAsterisk";

function StartAt({ formik, places }) {
  const selectStartPointHandler = useCallback(
    (e) => {
      formik.setFieldValue("start_at", e.target.value);
    },
    [formik.values]
  );

  const inputChangeHandler = useCallback(
    (e) => {
      formik.setFieldValue("start_at_text", e.target.value);
    },
    [formik.values]
  );

  return (
    <div>
      <h6 className="mb-2">
        Điểm khởi hành <RedAsterisk />
      </h6>

      <div className="pb-1 row">
        <div className="col-12 col-sm-4">
          <p className="mb-1">Địa điểm</p>
          <select
            className="p-2 w-100"
            onChange={selectStartPointHandler}
            value={formik.values.start_at}
          >
            <option value="">Chọn</option>
            {places.map((place) => (
              <option key={place._id} value={place._id}>
                {place.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-sm-8">
          <p className="mb-1">Thông tin thêm</p>

          <input
            onChange={inputChangeHandler}
            className="p-2 w-100 d-block mt-2 mt-sm-0"
            placeholder="vd: đón tận nơi"
            value={formik.values.start_at_text}
          />
        </div>
      </div>
    </div>
  );
}

export default StartAt;
