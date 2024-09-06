import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React from "react";

const { Sider } = Layout;

import { useGlobalStore } from "@/stores/useGlobalStore";
import { HomeOutlined, SettingOutlined, TeamOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import clsx from "clsx";
// import { RiRobot2Line } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";

const menuItems: MenuProps["items"] = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: <NavLink to="/">首页</NavLink>,
  },
  {
    key: "agents",
    icon: <TeamOutlined />,
    label: <NavLink to="/agents">代理</NavLink>,
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: <NavLink to="/settings">设置</NavLink>,
  },
  {
    key: "accounts",
    icon: <UserOutlined />,
    label: <NavLink to="/accounts" >账户</NavLink>,
  },
  {
    key: "chatbot",
    label: <NavLink to="/chatbot">聊天机器人</NavLink>,
  },
];

const Sidebar: React.FC = () => {
  const { sidebar_collapse } = useGlobalStore();
  const location = useLocation();

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
        items={menuItems}
        selectedKeys={[location.pathname.split("/")[1] || "home"]}
      />
    </Sider>
  );
};

export default Sidebar;
