import { userLoader } from "@/pages/user/loader";
import { MenuProps } from "antd";
import {
  LayoutDashboard,
  RollerCoasterIcon,
  UserIcon,
  UserRoundCogIcon,
} from "lucide-react";
import { lazy, LazyExoticComponent, ReactNode } from "react";
import { DataRouteObject, NavLink, RouteObject } from "react-router-dom";
import { router } from ".";
const DashboardIndexPage = lazy(
  () => import("@/pages/dashboard/DashboardIndexPage")
);
const AppLayout = lazy(() => import("@/layout/AppLayout"));

const UserIndexPage = lazy(() => import("@/pages/user/UserIndexPage"));
const RoleIndexPage = lazy(() => import("@/pages/role/RoleIndexPage"));
export interface DynamicRoute {
  id: string;
  path: string;
  Component?: LazyExoticComponent<React.ComponentType<any>>;
  loader?: any;
  handle: {
    parentPaths?: string[];
    title: string;
    icon: ReactNode;
    key: string;
    permission: string;
  };
  children?: DynamicRoute[];
}

export const dynamicRouters: DynamicRoute[] = [
  {
    id: "dashboard",
    path: "dashboard",
    Component: DashboardIndexPage,
    handle: {
      title: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      key: "dashboard",
      permission: "dashboard:view",
    },
  },
  {
    id: "user",
    path: "user",
    handle: {
      title: "User",
      icon: <UserIcon size={16} />,
      key: "user",
      permission: "user:view",
    },
    children: [
      {
        id: "user_list",
        path: "/user/list",
        Component: UserIndexPage,
        loader: userLoader,
        handle: {
          title: "User List",
          icon: <UserRoundCogIcon size={16} />,
          key: "list",
          permission: "user:view",
        },
      },
    ],
  },
  {
    id: "role",
    path: "role",
    Component: RoleIndexPage,
    handle: {
      title: "Role",
      icon: <RollerCoasterIcon size={16} />,
      key: "role",
      permission: "role:view",
    },
  },
];

export function getMenus(
  routes: DynamicRoute[],
  permissions: string[]
): MenuProps["items"] {
  return routes.map((route) => {
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
    router.routes[index].children = [];
    router.routes[index].children.push(
      ...addRoutes(dynamicRouters, permissions)
    );
  } else {
    console.error("未找到根路由或根路由没有子路由");
  }
};

// 示例用法：
// const routes = addRoutes(dynamicRoutes, ["dashboard:view", "user:view", "role:view"]);
// replaceRoutes(routes, ["dashboard:view", "user:view", "role:view"]);

// export default routes;
