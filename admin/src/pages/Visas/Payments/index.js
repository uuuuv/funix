// main
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { format } from "date-fns";

// components
import TopBar from "../../../components/TopBar";
import NotifyModal from "../../../components/NotifyModal";
import Pagination from "../../../containers/Pagination";
import { Table, THead, TBody, TCell } from "../../../components/table";
import PaymentModal from "./PaymentModal";

// other
import { PAGE_SIZE } from "../../../services/constants";
import { deleteVisaPayment, resetVisasState } from "../../../store/visas.slice";

// css
import SpinnerModal from "../../../components/SpinnerModal";
import usePageTitle from "../../../hooks/usePageTitle";
import * as paginationHelpers from "../../../services/helpers/pagination.helper";
import VisaPaymentItem from "./VisaPaymentItem";

function VisaPayments() {
  const [modalPayment, setModalPayment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  let { page } = useParams();
  if (!page) {
    page = 1;
  } else {
    page = Number(page);
  }

  const onShowModal = (payment) => {
    setModalPayment(payment);
  };

  let { payments, status, error } = useSelector((state) => state.visas);

  const deleteHandler = (payment) => {
    setConfirmDelete(payment);
  };

  const dispatch = useDispatch();

  const paginationHandler = (pageNumber) => {
    let path = `/visas/thanh-toan`;

    if (pageNumber > 1) {
      path += `/${pageNumber}`;
    }

    navigate(path);
  };

  const paginatedPayments = paginationHelpers.getPaginatedItems(
    page,
    PAGE_SIZE,
    payments
  );

  let notify = {};
  if (status.deleteVisaPayment === "succeeded") {
    notify = {
      type: "success",
      message: "Đã xóa",
      btn: {
        text: "OK",
        cb: () => {
          dispatch(resetVisasState("deleteVisaPayment"));
        },
        component: "button",
      },
      show: status.deleteVisaPayment === "succeeded",
    };
  }

  if (error.deleteVisaPayment) {
    notify = {
      type: "error",
      message: error.deleteVisaPayment.message,
      btn: {
        text: "OK",
        cb: () => {
          dispatch(resetVisasState("deleteVisaPayment"));
        },
        component: "button",
      },
      onHide: () => {
        dispatch(resetVisasState("deleteVisaPayment"));
      },
      show: error.deleteVisaPayment,
    };
  }

  if (confirmDelete) {
    notify = {
      type: "normal",
      message: `Bạn có chắc muốn xóa item: "${confirmDelete._id}" không?`,
      leftBtn: {
        text: "Có",
        cb: () => {
          dispatch(deleteVisaPayment(confirmDelete._id));
          setConfirmDelete(null);
        },
        component: "button",
      },
      rightBtn: {
        text: "Không",
        cb: () => {
          setConfirmDelete(null);
        },
        component: "button",
      },
      onHide: () => {
        setConfirmDelete(null);
      },
      show: confirmDelete,
    };
  }

  usePageTitle("Visa orders");
  return (
    <>
      <SpinnerModal
        show={
          status.fetchPayments === "pending" ||
          status.fetchPayments === "idle" ||
          status.deleteVisaPayment === "pending"
        }
      />
      <NotifyModal {...notify} />

      <TopBar title="Visa payments"></TopBar>
      {modalPayment && (
        <PaymentModal
          payment={modalPayment}
          show={Boolean(modalPayment)}
          onHide={() => {
            setModalPayment(null);
          }}
        />
      )}

      <div className="p-2">
        <div className="p-2 shadow rounded bg-light">
          {paginatedPayments.length > 0 && (
            <>
              <Table>
                <THead>
                  <tr>
                    <TCell w="70px">STT</TCell>
                    <TCell>Transaction ID</TCell>
                    <TCell w="280px">Họ tên</TCell>
                    <TCell w="160px">SĐT</TCell>
                    <TCell w="100px">Số khách</TCell>
                    <TCell w="150px">Đơn giá (USD)</TCell>
                    <TCell w="150px">Tổng tiền (USD)</TCell>
                    <TCell w="300px">Thời gian cập nhật</TCell>
                    <TCell w="150px">Trạng thái</TCell>
                    <TCell w="100px">Công cụ</TCell>
                  </tr>
                </THead>

                <TBody>
                  {paginatedPayments.map((payment, index) => (
                    <VisaPaymentItem
                      key={payment._id}
                      order={paginationHelpers.getOrder(page, PAGE_SIZE, index)}
                      payment={payment}
                      onDelete={deleteHandler}
                      onShowModal={onShowModal}
                    />
                  ))}
                </TBody>
              </Table>
            </>
          )}

          {status.fetchPayments === "succeeded" &&
            paginatedPayments.length === 0 && <p>No visa payments</p>}

          {status.fetchPayments === "succeeded" &&
            paginatedPayments.length > 0 && (
              <Pagination
                total={Math.ceil(payments.length / PAGE_SIZE)}
                pagenumber={page}
                callback={paginationHandler}
              />
            )}

          {error.fetchPayments && (
            <p className="text-danger m-0">{error.fetchPayments.message}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default VisaPayments;
