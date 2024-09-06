import current from "@/api/current";
import Logout from "@/pages/profile/Logout";
import UserProfile from "@/pages/profile/UserProfile";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Dropdown, Layout } from "antd";
import { AlignLeft, AlignRight } from "lucide-react";
import { Navigate } from "react-router-dom";
const { Header } = Layout;

const AppHeader = () => {
  const { access_token, toggleCollapsed, sidebar_collapse } = useGlobalStore();
  if (!access_token) return <Navigate to="/login" />;
  const { data } = useQuery({
    queryKey: ["current_user"],
    queryFn: () => current.getCurrentUser(),
  });

  return (
    <Header className="h-16 bg-transparent flex items-center justify-center shadow pl-4">
      <div
        onClick={toggleCollapsed}
        className="text-2xl cursor-pointer text-gray-500"
      >
        {sidebar_collapse ? <AlignLeft /> : <AlignRight />}
      </div>

      <div className="w-full flex justify-end">
        <Dropdown
          arrow
          menu={{
            items: [
              {
                key: "1",
                label: <UserProfile />,
              },
              {
                key: "2",
                label: <Logout />,
              },
            ],
          }}
          placement="bottomRight"
        >
          <Avatar
            src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    </Header>
  );
};
export default AppHeader;
