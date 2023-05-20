// main
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

// components
import NotifyModal from "../../components/NotifyModal";
import SpinnerModal from "../../components/SpinnerModal";
import PlaceModal from "./PlaceModal";
import TopBar from "../../components/TopBar";
import Pagination from "../../containers/Pagination";
import PlacesFilter from "./PlacesFilter";
import { Table, TBody, TCell, THead } from "../../components/table";

// other
import { PAGE_SIZE } from "../../services/constants";
import { useDispatch, useSelector } from "react-redux";
import { deletePlace, resetPlacesState } from "../../store/place.slice";
import PlaceItem from "./PlaceItem";
import { selectIsAdmin } from "../../store/user.slice";
import * as paginationHelpers from "../../services/helpers/pagination.helper";
import { searchHelper } from "../../services/helpers/search.helper";
import usePageTitle from "../../hooks/usePageTitle";

function Places() {
  const [confirmDelete, setConfirmDelete] = useState(null); // destination object
  const [modal, setModal] = useState({
    show: false,
    mode: "",
    initialValues: null,
  });
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);

  const { places, status, error } = useSelector((state) => state.places);

  const params = new URL(document.location).searchParams;
  const search = params.get("search") || "";

  const navigate = useNavigate();
  let { page, category } = useParams();
  if (!page) {
    page = 1;
  } else {
    page = Number(page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
  }

  if (!category) {
    category = "";
  }

  const addHandler = () => {
    setModal({
      show: true,
      mode: "add",
      initialValues: {
        type: "",
        continent: "",
        region: "",
        name: "",
        slug: "",
        image: "",
        en: { name: "" },
      },
    });
  };

  const confirmDeleteHandler = (dest) => {
    setConfirmDelete(dest);
  };

  const editHandler = (dest) => {
    setModal({
      show: true,
      mode: "edit",
      initialValues: dest,
    });
  };

  const hideHandler = () => {
    setModal((prev) => ({ ...prev, show: false }));
  };

  // notification
  let notify = {};
  if (confirmDelete) {
    notify = {
      show: Boolean(confirmDelete),
      type: "normal",
      message: `Bạn có chắc là muốn xóa "${confirmDelete.name}"?`,
      leftBtn: {
        component: "button",
        text: "Xóa",
        cb: () => {
          dispatch(deletePlace(confirmDelete._id));
          setConfirmDelete(null);
        },
      },
      rightBtn: {
        component: "button",
        text: "Hủy",
        cb: () => {
          setConfirmDelete(null);
        },
      },
    };
  }

  if (status.deletePlace === "succeeded") {
    notify = {
      show: status.deletePlace === "succeeded",
      type: "success",
      message: `Xóa địa điểm thành công`,
      btn: {
        component: "button",
        text: "OK",
        cb: () => {
          dispatch(resetPlacesState("deletePlace"));
        },
      },
    };
  }

  if (error.deletePlace) {
    notify = {
      show: Boolean(error.deletePlace),
      type: "error",
      message: error.deletePlace.message,
      btn: {
        component: "button",
        text: "OK",
        cb: () => {
          dispatch(resetPlacesState("deletePlace"));
        },
      },
    };
  }

  // filter
  let filteredPlaces = places;
  let paginatedPlaces = filteredPlaces || [];

  if (search) {
    filteredPlaces = filteredPlaces.filter(
      (item) =>
        searchHelper(search, item.name) || searchHelper(search, item.en.name)
    );
  }

  const totalPage = paginationHelpers.getTotalPage(filteredPlaces, PAGE_SIZE);

  paginatedPlaces = paginationHelpers.getPaginatedItems(
    page,
    PAGE_SIZE,
    filteredPlaces
  );

  const paginationHandler = (pageNumber) => {
    let path = `/diem-den`;

    if (pageNumber > 1) {
      path += `/${pageNumber}`;
    }

    if (search) {
      path += `?search=${search}`;
    }

    navigate(path);
  };

  usePageTitle("Điểm đến");

  return (
    <>
      <NotifyModal {...notify} />
      <SpinnerModal
        show={
          status.fetchPlaces === "pending" || status.deletePlace === "pending"
        }
      />
      <TopBar title="Quản lý địa điểm">
        {isAdmin && (
          <button onClick={addHandler} className="btn btn-primary">
            Thêm
          </button>
        )}
      </TopBar>

      <div className="p-2">
        <div className="p-2 shadow rounded bg-light">
          <div className="border-bottom pb-2 mb-3">
            <PlacesFilter />
          </div>
          {paginatedPlaces.length > 0 && (
            <Table>
              <THead>
                <tr>
                  <TCell w="70px">STT</TCell>
                  <TCell>Tên</TCell>
                  <TCell>Tên tiếng Anh</TCell>
                  <TCell>Vùng miền</TCell>
                  <TCell>Châu lục</TCell>
                  <TCell>Loại</TCell>
                  {isAdmin && <TCell w="160px">Công cụ</TCell>}
                </tr>
              </THead>

              <TBody>
                {paginatedPlaces.map((dest, index) => (
                  <PlaceItem
                    order={paginationHelpers.getOrder(page, PAGE_SIZE, index)}
                    key={dest._id}
                    place={dest}
                    onConfirmDelete={confirmDeleteHandler}
                    onEdit={editHandler}
                  />
                ))}
              </TBody>
            </Table>
          )}

          {paginatedPlaces.length === 0 &&
            !search &&
            status.fetchPlaces === "succeeded" && <p>Không có địa điểm nào</p>}

          {paginatedPlaces.length === 0 &&
            search &&
            status.fetchPlaces === "succeeded" && (
              <p>Không tìm thấy kết quả phù hợp</p>
            )}

          {filteredPlaces.length > 0 && (
            <Pagination
              total={totalPage}
              pagenumber={page}
              callback={paginationHandler}
            />
          )}
        </div>

        {places && (
          <PlaceModal {...modal} onHide={hideHandler} destinations={places} />
        )}
      </div>
    </>
  );
}

export default Places;
