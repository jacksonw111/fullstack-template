import { MenuProps } from "antd";
import { lazy } from "react";
import { DataRouteObject, NavLink, RouteObject } from "react-router-dom";
import { router } from ".";
import { DynamicRoute, dynamicRouters } from "./routes";
const NotFoundIndexPage = lazy(() => import("@/pages/error/NotFoundIndexPage"));
export function getMenus(
  routes: DynamicRoute[],
  permissions: string[]
): MenuProps["items"] {
  return routes.map((route) => {
    if (route.handle?.show === false) {
      return null;
    }

    if (
      route.handle?.permission &&
      !permissions.includes(route.handle.permission)
    ) {
      return null;
    }

    if (route.children && route.children.length != 0) {
      return {
        key: route.id,
        icon: route.handle.icon,
        label: route.handle.title,
        children: getMenus(route.children || [], permissions),
      };
    }

    return {
      key: route.id,
      icon: route.handle.icon,
      label: <NavLink to={route.path}>{route.handle.title}</NavLink>,
    };
  });
}

export const addRoutes = (
  routes: DynamicRoute[],
  permissions: string[]
): DataRouteObject[] => {
  return routes
    .map((route): RouteObject | null => {
      if (
        route.handle?.permission &&
        !permissions.includes(route.handle.permission)
      ) {
        return null;
      }

      return {
        id: route.id,
        path: route.path,
        Component: route.Component,
        children: addRoutes(route.children || [], permissions),
      };
    })
    .filter(Boolean) as DataRouteObject[];
};

export const replaceRoutes = (permissions: string[]) => {
  const index = router.routes.findIndex((it) => it.path === "/");
  if (index !== -1 && router.routes[index]?.children) {
    router.routes[index].children = [
      {
        id: "not-found",
        path: "*",
        Component: NotFoundIndexPage,
      },
    ];
    router.routes[index].children.push(
      ...addRoutes(dynamicRouters, permissions)
    );
  } else {
    console.error("未找到根路由或根路由没有子路由");
  }
};
