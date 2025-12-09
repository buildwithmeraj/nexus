import { createBrowserRouter } from "react-router";
import Home from "../components/pages/Home";
import Root from "../layouts/Root";

export const Routes = createBrowserRouter([
  {
    Component: Root,
    children: [{ path: "/", Component: Home }],
  },
]);
