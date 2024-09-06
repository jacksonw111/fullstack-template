import { lazy, LazyExoticComponent } from "react";
import { DataRouteObject, RouteObject } from "react-router-dom";
import { router } from ".";
const DashboardIndexPage = lazy(
  () => import("@/pages/dashboard/DashboardIndexPage")
);
const AppLayout = lazy(() => import("@/layout/AppLayout"));

const UserIndexPage = lazy(() => import("@/pages/user/UserIndexPage"));
const RoleIndexPage = lazy(() => import("@/pages/role/RoleIndexPage"));
interface DynamicRoute {
  id: string;
  path: string;
  Component: LazyExoticComponent<React.ComponentType<any>>;
  meta: {
    title: string;
    icon: string;
    key: string;
    permission: string;
  };
  children?: DynamicRoute[];
}
const dynamicRouters: DynamicRoute[] = [
  {
    id: "dashboard",
    path: "dashboard",
    Component: DashboardIndexPage,
    meta: {
      title: "Dashboard",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdhdWdlIj48cGF0aCBkPSJtMTIgMTQgNC00Ii8+PHBhdGggZD0iTTMuMzQgMTlhMTAgMTAgMCAxIDEgMTcuMzIgMCIvPjwvc3ZnPg==",
      key: "dashboard",
      permission: "dashboard:view",
    },
  },
  {
    id: "user",
    path: "user",
    Component: UserIndexPage,
    meta: {
      title: "User",
      icon: "User",
      key: "user",
      permission: "user:view",
    },
  },
  {
    id: "role",
    path: "role",
    Component: RoleIndexPage,
    meta: {
      title: "Role",
      icon: "Role",
      key: "role",
      permission: "role:view",
    },
  },
];

export const addRoutes = (
  routes: DynamicRoute[],
  permissions: string[]
): DataRouteObject[] => {
  return routes
    .map((route): RouteObject | null => {
      if (
        route.meta?.permission &&
        !permissions.includes(route.meta.permission)
      ) {
        return null;
      }

      return {
        path: route.path,
        Component: route.Component,
        children: addRoutes(route.children || [], permissions),
      };
    })
    .filter(Boolean) as DataRouteObject[];
};

export const replaceRoutes = (
  routes: DynamicRoute[],
  permissions: string[]
) => {
  const index = router.routes.findIndex((it) => it.path === "/");
  if (index !== -1 && router.routes[index]?.children) {
    router.routes[index].children.push(...addRoutes(routes, permissions));
  } else {
    console.error("未找到根路由或根路由没有子路由");
  }
  router.navigate(`${location.pathname}${location.search}`, { replace: true });
};

// 示例用法：
// const routes = addRoutes(dynamicRoutes, ["dashboard:view", "user:view", "role:view"]);
// replaceRoutes(routes, ["dashboard:view", "user:view", "role:view"]);

// export default routes;
