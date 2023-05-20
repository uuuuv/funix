// main
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

// components
import TopBar from "../../components/TopBar";
import SpinnerModal from "../../components/SpinnerModal";
import RedAsterisk from "../../components/RedAsterisk";

// other
import usePageTitle from "../../hooks/usePageTitle";
import useAxios from "../../hooks/useAxios";
import styles from "./Settings.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { fetchSettings, updateSettings } from "../../services/apis";

function Settings() {
  const [sendRequest, isLoading, settings, error] = useAxios(
    (data) => data.data
  );
  const [goUpdate, isUpdating, updatedData, updatingError, resetUpdate] =
    useAxios((data) => data.data);

  const submitRef = useRef();

  const submitTrigger = () => {
    if (submitRef.current) {
      submitRef.current.click();
    }
  };

  const submitHandler = (values) => {
    resetUpdate();
    goUpdate(updateSettings(values));
  };

  const validator = Yup.object().shape({
    sheetId: Yup.string().required().max(255),
    tourBookingSheetId: Yup.string()
      .matches(
        /^[a-z0-9-]{1,50}$/i,
        "1 - 50 ký tự. Chỉ được chứa chữ cái không dấu, số, dấu gạch ngang(không được chứa ký tự đặc biệt và khoảng trắng)"
      )
      .required(),
    tourCallbackRequestSheetId: Yup.string()
      .matches(
        /^[a-z0-9-]{1,50}$/i,
        "1 - 50 ký tự. Chỉ được chứa chữ cái không dấu, số, dấu gạch ngang(không được chứa ký tự đặc biệt và khoảng trắng)"
      )
      .required(),
  });

  const initialValues = updatedData ? updatedData : settings ? settings : null;

  useEffect(() => {
    sendRequest(fetchSettings());
  }, []);

  usePageTitle("Thiết lập");
  return (
    <>
      <SpinnerModal show={isLoading || isUpdating} />
      <TopBar title="Thiết lập">
        {initialValues && (
          <button
            onClick={submitTrigger}
            className="btn btn-primary"
            type="submit"
          >
            Lưu
          </button>
        )}
      </TopBar>

      <div className="p-2">
        <div className="p-3 bg-light shadow rounded">
          <p>
            Share quyền chỉnh sửa Google Sheet của bạn với{" "}
            <u>
              for-google-sheet@funix-graduation-project.iam.gserviceaccount.com
            </u>{" "}
            để nhận được thông tin từ khách hàng
          </p>
          {initialValues && (
            <Formik
              initialValues={initialValues}
              onSubmit={submitHandler}
              enableReinitialize
              validationSchema={validator}
            >
              <Form>
                <label className={styles.formGroup}>
                  <h6>
                    SheetID <RedAsterisk />
                  </h6>
                  <div>
                    <Field name="sheetId" className="form-control" />
                    <ErrorMessage
                      className="text-danger"
                      component="p"
                      name="sheetId"
                    />
                  </div>
                </label>

                <label className={styles.formGroup}>
                  <h6>
                    Đặt tour sheetID <RedAsterisk />
                  </h6>
                  <div>
                    <Field name="tourBookingSheetId" className="form-control" />
                    <ErrorMessage
                      className="text-danger"
                      component="p"
                      name="tourBookingSheetId"
                    />
                  </div>
                </label>

                <label className={styles.formGroup}>
                  <h6>
                    Tư vấn tour sheetID <RedAsterisk />
                  </h6>
                  <div>
                    <Field
                      name="tourCallbackRequestSheetId"
                      className="form-control"
                    />
                    <ErrorMessage
                      className="text-danger"
                      component="p"
                      name="tourCallbackRequestSheetId"
                    />
                  </div>
                </label>

                <button ref={submitRef} hidden type="submit">
                  Submit
                </button>
              </Form>
            </Formik>
          )}
          {updatedData && (
            <p className="text-success pt-3 border-top border-success mt-3">
              Cập nhật thiết lập thành công
            </p>
          )}
          {error && (
            <p className="text-danger border-top border-danger pt-3 mt-3">
              {error.message}
            </p>
          )}
          {updatingError && (
            <p className="text-danger border-top border-danger pt-3 mt-3">
              {updatingError.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Settings;
