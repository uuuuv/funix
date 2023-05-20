import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { v4 as uuid } from "uuid";
import NotifyModal from "../../../../../components/NotifyModal";
import styles from "./RatingModal.module.css";
import {
  mediumTextValidator as mt,
  longTextValidator as lt,
} from "../../../../../services/helpers/validator.helper";

const validator = (values) => {
  const errors = {};
  if (mt(values.name)) {
    errors.name = mt(values.name);
  }

  if (lt(values.content)) {
    errors.content = lt(values.content);
  }

  return errors;
};

function RatingModal({ ratingItem, rating, setFieldValue, ...props }) {
  const [isSuccess, setIsSuccess] = useState(false);

  const initialValues = ratingItem || {
    name: "",
    stars: 5,
    content: "",
    _id: uuid(),
  };

  const submitHandler = (values) => {
    const val = { ...values, stars: Number(values.stars) };
    // nếu là sửa đánh giá
    if (ratingItem) {
      setFieldValue(
        "rating",
        rating.map((item) => (item?._id === val._id ? val : item)),
        false
      );
    }

    // nếu là thêm mới đánh giá
    if (!ratingItem) {
      setFieldValue("rating", [...rating, val], false);
    }

    setIsSuccess(true);
  };

  useEffect(() => {
    if (isSuccess) {
      props.onHide();
    }
  }, [isSuccess]);

  let notify = {};
  if (isSuccess) {
    notify = {
      type: "success",
      time: 3000,
      message: "Đã thêm",
      btn: {
        component: "button",
        cb: () => {
          // props.onHide();
          setIsSuccess(false);
        },
      },
      show: isSuccess,
    };
  }

  return (
    <>
      <NotifyModal {...notify} />

      <Modal
        contentClassName={styles.container}
        {...props}
        onHide={() => {
          props.onHide();
        }}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h5>Thêm đánh giá tour</h5>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            onSubmit={submitHandler}
            validate={validator}
          >
            <Form>
              <div className="row">
                <div className="col-8">
                  <label className="d-block mb-4">
                    <h6 className="fs-6 mb-1">Tên</h6>
                    <Field type="text" name="name" className="w-100 p-1" />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-danger"
                    />
                  </label>
                </div>

                <div className="col-4">
                  <label className="d-block mb-4">
                    <h6 className="fs-6 mb-1">Số sao</h6>
                    <Field as="select" name="stars" className="w-100 p-1">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Field>
                    <ErrorMessage
                      name="stars"
                      component="p"
                      className="text-danger"
                    />
                  </label>
                </div>
              </div>

              <label className="d-block mb-4">
                <h6 className="fs-6 mb-1">Bình luận</h6>
                <Field as="textarea" name="content" className="w-100 p-1" />
                <ErrorMessage
                  name="content"
                  component="p"
                  className="text-danger"
                />
              </label>

              <button className="btn btn-primary" type="submit">
                {ratingItem ? "Cập nhật" : "Thêm"}
              </button>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RatingModal;
