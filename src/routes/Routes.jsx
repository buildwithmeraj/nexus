import { createBrowserRouter } from "react-router";

/* ========= Layouts ========= */
import Root from "../layouts/Root";
import Sidebar from "../layouts/Sidebar";

/* ========= Route Guards ========= */
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ClubManagerRoute from "./ClubManagerRoute";

/* ========= Public Pages ========= */
import Home from "../components/pages/root/Home";
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import Clubs from "../components/pages/root/Clubs";
import ClubDetails from "../components/pages/root/ClubDetails";
import AllEvents from "../components/pages/root/AllEvents";
import EventDetails from "../components/pages/root/EventDetails";
import MembershipSuccess from "../components/pages/root/MembershipSuccess";
import EventRegistrationSuccess from "../components/pages/root/EventRegistrationSuccess";

/* ========= Dashboards ========= */
import Member from "../components/pages/dashboards/Member";
import Admin from "../components/pages/dashboards/Admin";
import ClubManager from "../components/pages/dashboards/ClubManager";

/* ========= Member ========= */
import JoinedClubs from "../components/pages/member/JoinedClubs";
import JoinedEvents from "../components/pages/member/JoinedEvents";
import ApplyForClubManager from "../components/pages/member/ApplyForClubManager";

/* ========= Club Manager ========= */
import ClubsList from "../components/pages/manager/ClubsList";
import ManageClub from "../components/pages/manager/ManageClub";
import AddClub from "../components/pages/manager/AddClub";
import EventsList from "../components/pages/manager/EventsList";
import ClubEvents from "../components/pages/manager/ClubEvents";
import AddEvent from "../components/pages/manager/AddEvent";

/* ========= Admin ========= */
import UsersList from "../components/pages/admin/UsersList";
import AdminClubsList from "../components/pages/admin/ClubsList";

export const Routes = createBrowserRouter([
  /* ================= PUBLIC ================= */
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      { path: "clubs", element: <Clubs /> },
      { path: "clubs/:id", element: <ClubDetails /> },

      { path: "events", element: <AllEvents /> },
      { path: "events/:id", element: <EventDetails /> },

      {
        element: <PrivateRoute />,
        children: [
          { path: "membership-success", element: <MembershipSuccess /> },
          {
            path: "event-registration-success",
            element: <EventRegistrationSuccess />,
          },
        ],
      },
    ],
  },

  /* ================= DASHBOARD ================= */
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        element: <Sidebar />,
        children: [
          /* ----- Default (Member Dashboard) ----- */
          { index: true, element: <Member /> },

          /* ----- Member ----- */
          { path: "member", element: <Member /> },
          { path: "member/clubs", element: <JoinedClubs /> },
          { path: "member/events", element: <JoinedEvents /> },
          {
            path: "member/apply-for-club-manager",
            element: <ApplyForClubManager />,
          },

          /* ----- Club Manager ----- */
          {
            element: <ClubManagerRoute />,
            children: [
              { path: "club-manager", element: <ClubManager /> },
              { path: "club-manager/clubs", element: <ClubsList /> },
              { path: "club-manager/clubs/add", element: <AddClub /> },
              { path: "club-manager/clubs/:id", element: <ManageClub /> },

              { path: "club-manager/events", element: <EventsList /> },
              {
                path: "club-manager/clubs/:id/events",
                element: <ClubEvents />,
              },
              {
                path: "club-manager/events/add",
                element: <AddEvent />,
              },
              {
                path: "club-manager/clubs/:id/events/add",
                element: <AddEvent />,
              },
            ],
          },

          /* ----- Admin ----- */
          {
            element: <AdminRoute />,
            children: [
              { path: "admin", element: <Admin /> },
              { path: "admin/users", element: <UsersList /> },
              { path: "admin/clubs", element: <AdminClubsList /> },
              { path: "admin/payments", element: <Admin /> },
            ],
          },
        ],
      },
    ],
  },
]);
