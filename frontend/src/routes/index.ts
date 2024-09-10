import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const AppLayout = lazy(() => import("@/layout/AppLayout"));
const LoginIndexPage = lazy(() => import("@/pages/login/LoginIndexPage"));
const NotFoundIndexPage = lazy(() => import("@/pages/error/NotFoundIndexPage"));

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginIndexPage,
  },
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "*",
        Component: NotFoundIndexPage,
      },
    ],
  },
]);
