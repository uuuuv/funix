import { useState } from "react";
import RatingModal from "./RatingModal";
import styles from "./Rating.module.css";

function Rating({ rating, formik }) {
  const [modal, setModal] = useState({
    isShow: false,
    ratingItem: null,
  });

  // handlers
  const deleteRatingItemHandler = (ratingId) => {
    formik.setFieldValue(
      "rating",
      rating.filter((item) => item._id !== ratingId),
      false
    );
  };

  let average =
    rating.length > 0
      ? rating.reduce((p, c) => p + c.stars, 0) / rating.length
      : 0;

  if (average > Math.floor(average) && average <= Math.floor(average) + 0.5) {
    average = Math.floor(average) + 0.5;
  }

  if (average > Math.floor(average) + 0.5 && average <= Math.ceil(average)) {
    average = Math.ceil(average);
  }

  return (
    <>
      <div className={styles.container}>
        {rating.length === 0 && <h5>Hiện không có đánh giá nào</h5>}

        <button
          onClick={() =>
            setModal({
              isShow: true,
              mode: "create",
              ratingId: "",
            })
          }
          className="btn btn-primary btn-sm mb-2"
          to="/new-tour"
          type="button"
        >
          Thêm đánh giá
        </button>

        {rating.length > 0 && (
          <>
            <h5>Điểm trung bình: {average}</h5>

            <table className="table table-bordered bg-light">
              <thead className="bg-dark text-light text-center">
                <tr>
                  <th style={{ width: "60px" }}>
                    <div>STT</div>
                  </th>
                  <th>
                    <div>Tên</div>
                  </th>
                  <th style={{ width: "60px" }}>
                    <div className="text-center">Số sao</div>
                  </th>
                  <th>
                    <div>Nội dung</div>
                  </th>
                  <th>
                    <div>Công cụ</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rating.map((item, index) => (
                  <tr key={item._id}>
                    <td>
                      <div className="text-center">{index + 1}</div>
                    </td>
                    <td>
                      <div>{item.name}</div>
                    </td>
                    <td>
                      <div>{item.stars}</div>
                    </td>
                    <td>
                      <div>{item.content}</div>
                    </td>
                    <td style={{ width: "200px" }}>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          onClick={() =>
                            setModal({
                              isShow: true,
                              ratingItem: item,
                            })
                          }
                          className="btn btn-warning mx-1"
                          type="button"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteRatingItemHandler(item._id)}
                          className="btn btn-danger mx-1"
                          type="button"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <RatingModal
        show={modal.isShow}
        onHide={() =>
          setModal({
            isShow: false,
            ratingItem: null,
          })
        }
        ratingItem={modal.ratingItem}
        rating={rating}
        setFieldValue={formik.setFieldValue}
      />
    </>
  );
}

export default Rating;
