import { userLoader } from "@/pages/user/loader";
import { ChartPie, SquareUserRound, UserRoundCog } from "lucide-react";
import { lazy, LazyExoticComponent, ReactNode } from "react";
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
    show?: boolean;
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
      icon: <ChartPie size={16} />,
      key: "dashboard",
      permission: "dashboard:view",
      show: true,
    },
  },
  {
    id: "user",
    path: "user",
    Component: UserIndexPage,
    loader: userLoader,
    handle: {
      title: "User",
      icon: <UserRoundCog size={16} />,
      key: "user",
      permission: "user:view",
      show: true,
    },
    // children: [
    //   {
    //     id: "user_list",
    //     path: "/user/list",
    //     Component: UserIndexPage,
    //     loader: userLoader,
    //     handle: {
    //       title: "User List",
    //       icon: <UserRoundCogIcon size={16} />,
    //       key: "list",
    //       permission: "user:view",
    //     },
    //   },
    // ],
  },
  {
    id: "role",
    path: "role",
    Component: RoleIndexPage,
    handle: {
      title: "Role",
      icon: <SquareUserRound size={16} />,
      key: "role",
      permission: "role:view",
      show: true,
    },
  },
];
