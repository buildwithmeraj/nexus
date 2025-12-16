import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import Sidebar from "../layouts/Sidebar";

/* ---------- Public Pages ---------- */
import Home from "../components/pages/root/Home";
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import ClubDetails from "../components/pages/root/ClubDetails";
import MembershipSuccess from "../components/pages/root/MembershipSuccess";
import EventDetails from "../components/pages/root/EventDetails";
import EventRegistrationSuccess from "../components/pages/root/EventRegistrationSuccess";
import ApplyForClubManager from "../components/pages/member/ApplyForClubManager";
import Clubs from "../components/pages/root/Clubs";
import AllEvents from "../components/pages/root/AllEvents";

/* ---------- Dashboards ---------- */
import Member from "../components/pages/dashboards/Member";
import Admin from "../components/pages/dashboards/Admin";
import ClubManager from "../components/pages/dashboards/ClubManager";

/* ---------- Manager ---------- */
import AddClub from "../components/pages/manager/AddClub";
import ManageClub from "../components/pages/manager/ManageClub";
import AddEvent from "../components/pages/manager/AddEvent";

/* ---------- Members ---------- */
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ClubManagerRoute from "./ClubManagerRoute";
import ClubEvents from "../components/pages/manager/ClubEvents";
import ClubsList from "../components/pages/manager/ClubsList";
import EventsList from "../components/pages/manager/EventsList";
import UsersList from "../components/pages/admin/UsersList";
import AdminClubsList from "../components/pages/admin/ClubsList";
import JoinedClubs from "../components/pages/member/JoinedClubs";
import JoinedEvents from "../components/pages/member/JoinedEvents";

export const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      /* ===== Public ===== */
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "clubs", element: <Clubs /> },
      { path: "events", element: <AllEvents /> },
      { path: "clubs/:id", element: <ClubDetails /> },
      { path: "events/:id", element: <EventDetails /> },

      /* ===== Private (non-dashboard) ===== */
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

  /* ================= DASHBOARD WITH SIDEBAR ================= */
  {
    path: "/dashboard",
    element: <PrivateRoute />,
    children: [
      {
        element: <Sidebar />,
        children: [
          /* ===== Default (Member) ===== */
          { index: true, element: <Member /> },

          /* ===== Member Routes ===== */
          { path: "member", element: <Member /> },
          { path: "member/clubs", element: <JoinedClubs /> },
          { path: "member/events", element: <JoinedEvents /> },
          {
            path: "member/apply-for-club-manager",
            element: <ApplyForClubManager />,
          },

          /* ===== Club Manager Routes ===== */
          {
            element: <ClubManagerRoute />,
            children: [
              { path: "club-manager", element: <ClubManager /> },
              { path: "club-manager/clubs", element: <ClubsList /> },
              { path: "club-manager/events", element: <EventsList /> },
              { path: "club-manager/add-club", element: <AddClub /> },
              { path: "club-manager/clubs/:id", element: <ManageClub /> },
              {
                path: "club-manager/clubs/:id/events",
                element: <ClubEvents />,
              },
              {
                path: "club-manager/events/add-event",
                element: <AddEvent />,
              },
              {
                path: "club-manager/clubs/:id/events/add-event",
                element: <AddEvent />,
              },
            ],
          },

          /* ===== Admin Routes ===== */
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
