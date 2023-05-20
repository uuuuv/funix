import { useSelector } from "react-redux";
import styles from "./TourItem.module.css";
import { selectIsAdmin } from "../../../store/user.slice";

function TourItem({ tour, onClick }) {
  const clickHandler = () => {
    onClick(tour);
  };
  const isAdmin = useSelector(selectIsAdmin);

  let classes = styles.tourItem;
  if (!isAdmin) classes += " " + styles.disabled;

  return (
    <li className={classes + " list-group-item"} onClick={clickHandler}>
      {tour.name} [{tour.code}]
    </li>
  );
}

export default TourItem;
