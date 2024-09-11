import { Layout, Menu } from "antd";
import React, { useEffect } from "react";

const { Sider } = Layout;

import { router } from "@/routes";
import { dynamicRouters } from "@/routes/routes";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { MenuProps } from "antd";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { getMenus, replaceRoutes } from "@/routes/utils";

const Sidebar: React.FC = () => {
  const { sidebar_collapse, current_user } = useGlobalStore();
  const location = useLocation();

  const menuItems: MenuProps["items"] = getMenus(
    dynamicRouters,
    current_user?.permissions || []
  );

  console.log(location.pathname.split("/"));

  useEffect(() => {
    if (current_user && current_user.permissions) {
      replaceRoutes(current_user.permissions);
      router.navigate(`${location.pathname}${location.search}`, {
        replace: true,
      });
    }
  }, [current_user]);

  return (
    <Sider
      collapsedWidth={81}
      trigger={null}
      collapsible
      collapsed={sidebar_collapse}
      className="h-screen"
    >
      <div className=" p-4 flex items-center justify-center">
        {/* 在这里添加你的logo */}
        {sidebar_collapse ? (
          <img
            src="https://www.justsayai.org/wp-content/uploads/sites/6/2024/05/Group-11.png"
            alt="Logo"
            className={clsx(sidebar_collapse ? "w-10" : "w-full p-3")}
          />
        ) : (
          <img
            src="https://www.justsayai.org/wp-content/uploads/sites/6/2024/04/Group-2.png"
            alt="Logo"
            className={clsx(sidebar_collapse ? "w-10" : "w-full p-3")}
          />
        )}
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["home"]}
        items={menuItems || []}
        subMenuCloseDelay={0}
        selectedKeys={location.pathname.split("/").slice(1)}
      />
    </Sider>
  );
};

export default Sidebar;
