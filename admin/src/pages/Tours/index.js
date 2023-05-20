// main
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate, Navigate, useParams } from "react-router-dom";

// components
import { Table, TBody, TCell, THead } from "../../components/table";
import SpinnerModal from "../../components/SpinnerModal";
import Filter from "./Filter";
import TopBar from "../../components/TopBar";
import Pagination from "../../containers/Pagination";
import ToursNotificationModal from "./ToursNotificationModal";
import TourItem from "./TourItem";

// other
import * as paginationHelpers from "../../services/helpers/pagination.helper";
import { selectIsAdmin } from "../../store/user.slice";
import { PAGE_SIZE } from "../../services/constants";
import usePageTitle from "../../hooks/usePageTitle";
import { selectTours } from "../../store/tours.slice";
import { searchHelper } from "../../services/helpers/search.helper";

const CHAU_AU = "chau-au";
const VIET_NAM = "viet-nam";

const toursFilter = (tours, category, search) => {
  let t = tours;

  // Tour châu Âu
  if (category === CHAU_AU) {
    t = t.filter((item) => item.is_eu_tour);
  }

  // Tour trong nước
  if (category === VIET_NAM) {
    t = t.filter((item) => item.is_vn_tour);
  }

  // search
  if (search) {
    t = t.filter((tour) => searchHelper(search, tour.name));
  }

  return t;
};

function Tours() {
  const [confirmDelete, setConfirmDelete] = useState(null); // null | tour
  const { tours, status, error } = useSelector(selectTours);
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);

  const params = new URL(document.location).searchParams;
  const search = params.get("search") || "";

  let { page, category } = useParams();
  if (!page) {
    page = 1;
  } else {
    page = Number(page);
  }

  // handle page and filter tours
  const filteredTours = toursFilter(tours, category, search);
  const paginatedTours = paginationHelpers.getPaginatedItems(
    page,
    PAGE_SIZE,
    filteredTours
  );
  const totalPage = Math.ceil(filteredTours.length / PAGE_SIZE);

  // handlers
  const onDelete = (tour) => {
    setConfirmDelete(tour);
  };

  const paginationHandler = (pageNumber) => {
    let path = `/tours`;

    if (category) {
      path += `/phan-loai/${category}`;
    }

    if (pageNumber > 1) {
      path += `/${pageNumber}`;
    }

    if (search) {
      path += `?search=${search}`;
    }

    navigate(path);
  };

  usePageTitle("Quản lý tour");

  const isInvalidCategory =
    category && ![VIET_NAM, CHAU_AU].includes(category.trim());

  const isInvalidPageNumber =
    isNaN(page) || !Number.isInteger(page) || page < 1;

  if (isInvalidCategory || isInvalidPageNumber) return <Navigate to="/tours" />;

  return (
    <>
      <ToursNotificationModal
        wasDeleted={status.deleteTour === "succeeded"}
        deletingError={error.deleteTour}
        tourConfirmToDelete={confirmDelete}
        finishConfirmToDelete={() => setConfirmDelete(null)}
      />

      <SpinnerModal
        show={
          status.fetchTours === "pending" || status.deleteTour === "pending"
        }
      />

      <TopBar title="Quản lý tour">
        {status.fetchTours === "succeeded" && isAdmin && (
          <>
            <Link to="/tours/them-moi" className="btn btn-primary me-2">
              Tạo tour mới
            </Link>
            <Link className="btn btn-primary" to="/tours/noi-bat">
              Quản lý tour nổi bật
            </Link>
          </>
        )}
      </TopBar>

      <div className="p-2">
        {status.fetchTours === "succeeded" && (
          <div className="bg-light p-2 shadow rounded">
            <Filter />

            {paginatedTours.length > 0 && (
              <Table>
                <THead>
                  <tr>
                    <TCell w="50px">STT</TCell>
                    <TCell w="80px">Mã tour</TCell>
                    <TCell>Tên tour</TCell>
                    <TCell w="120px">Danh mục</TCell>
                    {isAdmin && <TCell w="120px">Chức năng</TCell>}
                  </tr>
                </THead>

                <TBody>
                  {paginatedTours.map((tour, index) => (
                    <TourItem
                      key={tour._id}
                      tour={tour}
                      order={paginationHelpers.getOrder(page, PAGE_SIZE, index)}
                      onDelete={onDelete}
                    />
                  ))}
                </TBody>
              </Table>
            )}

            {paginatedTours.length === 0 && !search && <p>Không có tour nào</p>}
            {paginatedTours.length === 0 && search && (
              <p>Không tìm thấy kết quả phù hợp</p>
            )}

            {totalPage > 0 && (
              <Pagination
                total={totalPage}
                pagenumber={page}
                callback={paginationHandler}
              />
            )}
          </div>
        )}

        {error.fetchTours && (
          <div className="shadow rounded bg-light p-2">
            <p className="text-danger m-0">{error.fetchTours.message}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Tours;
