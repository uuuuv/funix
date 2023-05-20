// layout
import Layout from "../Layout";

// pages
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

// visa
import EditVisa from "../pages/Visas/EditVisa";
import AddVisa from "../pages/Visas/AddVisa";
import Visas from "../pages/Visas";
import VisaPayments from "../pages/Visas/Payments";

// tour
// import Tours from "../pages/Tours";
import Tours from "../pages/Tours";
import AddTour from "../pages/Tours/AddTour";
import UpdateTour from "../pages/Tours/UpdateTour";
import HotToursManager from "../pages/Tours/HotToursManager";

// guides
import Guides from "../pages/Guides";
import AddGuide from "../pages/Guides/AddGuide";
import EditArticle from "../pages/Guides/UpdateGuide";
import GuidesCategory from "../pages/Guides/GuidesCategory";

// term
import Terms from "../pages/Terms";

// about
import CompanyInfo from "../pages/CompanyInfo";

// user
import ChangePassword from "../pages/Users/ChangePassword";

// settings
import Settings from "../pages/Settings";

// users
import Users from "../pages/Users";
import CreateUser from "../pages/Users/CreateUser";
import ForgotPassword from "../pages/ForgotPassword";

// places
import Places from "../pages/Places";

const CLIENT = "client";
const ADMIN = "admin";

export default [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/quen-mat-khau",
    element: <ForgotPassword />,
    layout: Layout,
  },
  // diem den
  {
    paths: ["/diem-den", "/diem-den/:page"],
    element: <Places />,
    layout: Layout,
    role: CLIENT,
  },
  // tours
  {
    paths: [
      "/",
      "/tours",
      "/tours/:page",
      "/tours/phan-loai/:category",
      "/tours/phan-loai/:category/:page",
    ],
    element: <Tours />,
    layout: Layout,
    role: CLIENT,
  },
  {
    path: "/tours/them-moi",
    element: <AddTour />,
    layout: Layout,
    role: ADMIN,
  },
  {
    path: "/tours/noi-bat",
    element: <HotToursManager />,
    layout: Layout,
    role: CLIENT,
  },
  {
    path: "/tours/cap-nhat/:tourCode",
    element: <UpdateTour />,
    layout: Layout,
    role: CLIENT,
  },
  // guides
  {
    paths: [
      "/guides",
      "/guides/:page",
      "/guides/phan-loai/:category",
      "/guides/phan-loai/:category/:page",
    ],
    element: <Guides />,
    layout: Layout,
    role: CLIENT,
  },
  {
    path: "/guides/quan-ly-danh-muc",
    element: <GuidesCategory />,
    layout: Layout,
    role: CLIENT,
  },
  {
    path: "guides/them-moi",
    element: <AddGuide />,
    layout: Layout,
    role: ADMIN,
  },
  {
    path: "/guides/cap-nhat/:slug",
    element: <EditArticle />,
    layout: Layout,
    role: CLIENT,
  },
  // visa
  {
    paths: ["/visas", "/visas/:page"],
    element: <Visas />,
    layout: Layout,
    role: CLIENT,
  },
  {
    path: "/visas/them-moi",
    element: <AddVisa />,
    layout: Layout,
    role: ADMIN,
  },
  {
    path: "/visas/cap-nhat-visa/:slug",
    element: <EditVisa />,
    layout: Layout,
    role: CLIENT,
  },
  {
    paths: ["/visas/thanh-toan", "/visas/thanh-toan/:page"],
    element: <VisaPayments />,
    layout: Layout,
    role: ADMIN,
  },
  // tenrs
  {
    path: "/dieu-khoan",
    element: <Terms />,
    layout: Layout,
    role: CLIENT,
  },
  {
    path: "/users/doi-mat-khau",
    element: <ChangePassword />,
    layout: Layout,
    role: CLIENT,
  },
  // company info
  {
    path: "/thong-tin-cong-ty",
    element: <CompanyInfo />,
    layout: Layout,
    role: CLIENT,
  },
  // settings
  {
    path: "/thiet-lap",
    element: <Settings />,
    layout: Layout,
    role: ADMIN,
  },
  // users
  {
    path: "/users",
    element: <Users />,
    layout: Layout,
    role: CLIENT,
  },
  {
    path: "/users/them-user",
    element: <CreateUser />,
    layout: Layout,
    role: ADMIN,
  },
  // not found
  {
    path: "/*",
    element: <NotFound />,
    role: null,
  },
];
