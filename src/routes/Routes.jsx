import { createBrowserRouter } from "react-router";
import Home from "../components/pages/root/Home";
import Root from "../layouts/Root";
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import UserDashboard from "../components/pages/dashboards/User";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Admin from "../components/pages/dashboards/Admin";

export const Routes = createBrowserRouter([
  {
    Component: Root,
    children: [
      { path: "/", Component: Home },
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
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
