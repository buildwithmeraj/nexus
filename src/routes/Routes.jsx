import { createBrowserRouter } from "react-router";
import Home from "../components/pages/root/Home";
import Root from "../layouts/Root";
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import UserDashboard from "../components/pages/dashboards/User";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ClubManagerRoute from "./ClubManagerRoute";
import Admin from "../components/pages/dashboards/Admin";
import ApplyForClubManager from "../components/pages/member/ApplyForClubManager";
import ClubManager from "../components/pages/dashboards/ClubManager";
import AddClub from "../components/pages/manager/AddClub";
import ManageClub from "../components/pages/manager/ManageClub";
import ClubDetails from "../components/pages/root/ClubDetails";
import MembershipSuccess from "../components/pages/root/MembershipSuccess";

export const Routes = createBrowserRouter([
  {
    Component: Root,
    children: [
      { path: "/", Component: Home },
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
      {
        path: "/clubs/:id",
        element: <ClubDetails />,
      },
      {
        path: "/membership-success",
        element: (
          <PrivateRoute>
            <MembershipSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/apply-for-club-manager",
        element: (
          <PrivateRoute>
            <ApplyForClubManager />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/club-manager",
        element: (
          <PrivateRoute>
            <ClubManagerRoute>
              <ClubManager />
            </ClubManagerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/club-manager/add-club",
        element: (
          <PrivateRoute>
            <ClubManagerRoute>
              <AddClub />
            </ClubManagerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/club-manager/manage-club/:id",
        element: (
          <PrivateRoute>
            <ClubManagerRoute>
              <ManageClub />
            </ClubManagerRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/admin",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <Admin />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
