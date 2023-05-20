import { Formik, Form, Field } from "formik";
import { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";

// components
import ItineraryForm from "./ItineraryForm";
import Destinations from "./Destinations";
import TourRating from "./TourRating";
import TourImages from "./TourImages";
import DepartureDates from "./DepartureDates";
import RedAsterisk from "../../../components/RedAsterisk";
import FormErrorMessages from "../../../components/FormErrorMessages";
import FormGroup from "./FormGroup";
// import SetDefaultTermsButton from "./SetDefaultTerms";

// other
import tourValidator from "./tourValidator";
import touchAllFields from "./touchAllFields";
import {
  selectEuCountries,
  selectVnProvinces,
} from "../../../store/place.slice";

// css
import "./TourForm.override.css";
import ImageField from "./ImageField";
import { slugify } from "../../../services/helpers/string.helper";

function TourForm({ initialValues, onSubmit }, ref) {
  const [submitted, setSubmitted] = useState(false);
  const [formikKey, setFormikKey] = useState(0);
  const [images, setImages] = useState(new Map([]));
  const { status: tourStatus } = useSelector((state) => state.tours);
  const { error, status } = useSelector((state) => state.places);
  let eu_countries = useSelector(selectEuCountries);
  let vn_provinces = useSelector(selectVnProvinces);

  const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  // submit handler
  const submitHandler = async (e, formik) => {
    e.preventDefault();
    if (!submitted) {
      setSubmitted(true);
    }

    touchAllFields(formik);

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) return; // if error > return

    let v = JSON.parse(JSON.stringify(formik.values));
    const fileInputs = Array.from(images.values());

    v.thumb =
      fileInputs.find((item) => item.tempSrc === v.thumb)?.file || v.thumb;
    v.banner =
      fileInputs.find((item) => item.tempSrc === v.banner)?.file || v.banner;

    v.itinerary = v.itinerary.map((iti) => ({
      ...iti,
      images: iti.images.map((img) => {
        const foundFile = fileInputs.find((item) => item.tempSrc === img.url);
        return {
          ...img,
          url: foundFile ? foundFile.file : img.url,
        };
      }),
    }));

    onSubmit(v);
  };

  const onResetFormik = () => {
    setFormikKey((prev) => prev + 1);
  };

  const onSelectImages = (...images) => {
    setImages((prev) => {
      images.forEach((image) => {
        if (prev.has(image.fieldName)) {
          URL.revokeObjectURL(prev.get(image.fieldName).tempSrc);
        }
        prev.set(image.fieldName, {
          tempSrc: image.tempSrc,
          file: image.file,
        });
      });

      return prev;
    });
  };

  useEffect(() => {
    if (tourStatus.addTour === "succeeded") {
      Array.from(images.values()).forEach((item) => {
        URL.revokeObjectURL(item.tempSrc);
      });
    }
  }, [tourStatus]);
  return (
    <div className="bg-light p-2 rounded shadow">
      {error.fetchPlaces && (
        <p className="text-danger mb-1">{error.fetchPlaces.message}</p>
      )}

      {status.fetchPlaces === "succeeded" && (
        <Formik
          initialValues={initialValues}
          validate={tourValidator}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => {
            return (
              <Form
                key={formikKey}
                onSubmit={async (e) => {
                  await submitHandler(e, formik);
                }}
              >
                {formik.errors.messages && (
                  <FormErrorMessages messages={formik.errors.messages} />
                )}

                <div className="tourForm pb-2 pt-3">
                  {/* <SetDefaultTermsButton
                    formik={formik}
                    onResetFormik={onResetFormik}
                  /> */}
                  <Tabs defaultActiveKey="overview" className=" mb-0 border-0 ">
                    <Tab eventKey="overview" title="Tổng quan">
                      <div className="rounded-0">
                        <div className="row pb-4 border-bottom">
                          <div className="col-12 col-sm-6">
                            <FormGroup
                              isRequired
                              label="Mã tour"
                              component="input"
                              name="code"
                            />
                          </div>
                          <div className="col-12 col-sm-6">
                            <div className="d-flex align-items-end gap-2">
                              <div
                                style={{
                                  flex: 1,
                                }}
                              >
                                <FormGroup
                                  isRequired
                                  label="Slug"
                                  component="input"
                                  name="slug"
                                />
                              </div>
                              <button
                                style={{ height: "36px" }}
                                type="button"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "slug",
                                    slugify(formik.values.name)
                                  );
                                }}
                              >
                                Tạo tự động
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="row pt-4 pb-5 border-bottom">
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Tên tour"
                              component="input"
                              name="name"
                            />
                          </div>
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Tên tour tiếng Anh"
                              component="input"
                              name="en.name"
                            />
                          </div>
                        </div>

                        <div className="row pt-4 pb-5 border-bottom">
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Hành trình"
                              component="textarea"
                              name="journey"
                            />
                          </div>
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Hành trình tiếng Anh"
                              component="textarea"
                              name="en.journey"
                            />
                          </div>
                        </div>

                        <div className="row pt-4 pb-5 border-bottom">
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Mô tả"
                              component="textarea"
                              name="description"
                            />
                          </div>
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Mô tả tiếng Anh"
                              component="textarea"
                              name="en.description"
                            />
                          </div>
                        </div>

                        <div className="row pt-4 pb-5 border-bottom">
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Điểm nổi bật"
                              type="editor"
                              name="highlights"
                              formik={formik}
                            />
                          </div>
                          <div className="col-12 col-lg-6 mb-3">
                            <FormGroup
                              isRequired
                              label="Điểm nổi bật"
                              type="editor"
                              name="en.highlights"
                              formik={formik}
                            />
                          </div>
                        </div>

                        <div className="row pt-4 pb-5 border-bottom">
                          <h6 className="text-center">
                            ĐIỂM KHỞI HÀNH <RedAsterisk />
                          </h6>
                          <div className="col-12 col-lg-4 mb-3">
                            <h6 className="mb-0">Chọn điểm khởi hành</h6>
                            <Field
                              as="select"
                              name="start_at"
                              className="form-select"
                            >
                              <option value="">-----</option>
                              {vn_provinces.map((item) => (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              ))}
                            </Field>
                          </div>
                          <div className="col-12 col-lg-4 mb-3">
                            <FormGroup
                              label="Ghi chú"
                              type="text"
                              name="start_at_text"
                              formik={formik}
                            />
                          </div>
                          <div className="col-12 col-lg-4 mb-3">
                            <FormGroup
                              label="Ghi chú - tiếng Anh"
                              type="text"
                              name="en.start_at_text"
                              formik={formik}
                            />
                          </div>
                        </div>

                        <div className="row py-4 border-bottom">
                          <h6 className="text-center">
                            NGÀY KHỞI HÀNH <RedAsterisk />
                          </h6>
                          <div className="col-12 col-lg-4 mb-3">
                            <DepartureDates formik={formik} />
                          </div>

                          <div className="col-12 col-lg-4 mb-3">
                            <FormGroup
                              label="Ghi chú"
                              type="text"
                              name="departure_dates_text"
                              formik={formik}
                            />
                          </div>
                          <div className="col-12 col-lg-4 mb-3">
                            <FormGroup
                              label="Ghi chú - tiếng Anh"
                              type="text"
                              name="en.departure_dates_text"
                              formik={formik}
                            />
                          </div>
                        </div>

                        <div className="row pt-4 pb-5">
                          <div className="col-12 col-lg-4 mb-3">
                            <h6 style={{ marginBottom: "2px" }}>
                              Số ngày <RedAsterisk />
                            </h6>

                            <Field
                              className="form-select w-100"
                              as="select"
                              name="duration_days"
                            >
                              {days.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </Field>
                          </div>

                          <div className="col-12 col-lg-4 mb-3">
                            <h6 style={{ marginBottom: "2px" }}>
                              Số đêm <RedAsterisk />
                            </h6>

                            <Field
                              className="form-select w-100"
                              as="select"
                              name="duration_nights"
                            >
                              {[0, ...days].map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </Field>
                          </div>

                          <div className="col-12 col-lg-4 mb-3">
                            <FormGroup
                              isRequired
                              label="Giá"
                              note="(vnd)"
                              type="locale-number"
                              name="price"
                              formik={formik}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>

                    {/*  price policies   */}
                    <Tab eventKey="price" title="Bảng giá">
                      <div className="row pt-4 pb-5 border-bottom">
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Giá bao gồm"
                            name="price_policies.includes"
                            type="editor"
                            formik={formik}
                          />
                        </div>

                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Giá bao gồm - tiếng Anh"
                            name="en.price_policies.includes"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                      </div>

                      <div className="row pt-4 pb-5 border-bottom">
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Giá không bao gồm"
                            name="price_policies.excludes"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Giá không bao gồm - tiếng Anh"
                            name="en.price_policies.excludes"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                      </div>

                      <div className="row pt-4 pb-5 border-bottom">
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Giá trẻ em và phụ thu"
                            name="price_policies.other"
                            type="editor"
                            formik={formik}
                          />
                        </div>

                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Giá trẻ em và phụ thu - tiếng Anh"
                            name="en.price_policies.other"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                      </div>
                    </Tab>

                    {/*  terms   */}
                    <Tab eventKey="terms" title="Điều khoản">
                      <div className="row pt-4 pb-5 border-bottom">
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Điều kiện đăng ký"
                            name="terms.registration"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Điều kiện đăng ký tiếng Anh"
                            name="en.terms.registration"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                      </div>

                      <div className="row pt-4 pb-5 border-bottom">
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Điều kiện hoàn hủy"
                            name="terms.cancellation"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Điều kiện hoàn hủy tiếng Anh"
                            name="en.terms.cancellation"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                      </div>

                      <div className="row pt-4 pb-5 border-bottom">
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Phương thức thanh toán"
                            name="terms.payment"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            isRequired
                            label="Phương thức thanh toán tiếng Anh"
                            name="en.terms.payment"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                      </div>

                      <div className="row pt-4 pb-5 border-bottom">
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            label="Lưu ý"
                            name="terms.notes"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                        <div className="col-12 col-lg-6 mb-3">
                          <FormGroup
                            label="Lưu ý tiếng Anh"
                            name="en.terms.notes"
                            type="editor"
                            formik={formik}
                          />
                        </div>
                      </div>
                    </Tab>

                    {/* ----------------------- điểm đến ------------------------  */}

                    <Tab eventKey="destinations" title="Điểm đến">
                      <div className="row">
                        <div className="col-12 col-md-6  border-end">
                          <Destinations
                            title="Tour trong nước"
                            places={vn_provinces}
                            formik={formik}
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <Destinations
                            title="Tour châu Âu"
                            places={eu_countries}
                            formik={formik}
                          />
                        </div>
                      </div>
                    </Tab>

                    {/* ----------------------- lộ trình ------------------------  */}
                    <Tab eventKey="itinerary" title="Lộ trình">
                      <ItineraryForm
                        itinerary={formik.values.itinerary}
                        formik={formik}
                        name="itinerary"
                      />
                    </Tab>

                    {/* ----------------------- hình ảnh: thumbnail, banner, lộ trình ------------------------  */}
                    <Tab eventKey="images" title="Hình ảnh">
                      <div className="border-bottom row pb-4">
                        <div className="col-6">
                          <ImageField
                            isRequired
                            label="Ảnh đại diện"
                            name="thumb"
                            formik={formik}
                            onSelectImages={onSelectImages}
                          />
                        </div>

                        <div className="col-6">
                          <ImageField
                            isRequired
                            label="Ảnh banner"
                            name="banner"
                            formik={formik}
                            onSelectImages={onSelectImages}
                          />
                        </div>
                      </div>

                      <div className="pt-3">
                        <TourImages
                          formik={formik}
                          onSelectImages={onSelectImages}
                        />
                      </div>
                    </Tab>

                    {/* ----------------------- rating ------------------------  */}
                    <Tab eventKey="rating" title="Đánh giá">
                      <TourRating
                        rating={formik.values.rating}
                        name="rating"
                        formik={formik}
                      />
                    </Tab>
                  </Tabs>
                </div>

                <button type="submit" ref={ref} hidden />
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
}

export default forwardRef(TourForm);
