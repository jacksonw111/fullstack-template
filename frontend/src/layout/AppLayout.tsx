import current from "@/api/current";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "antd";
import { AnimatePresence, m } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import Sidebar from "./AppSidebar";

const { Content } = Layout;
const AppLayout = () => {
  const location = useLocation();
  const { setCurrentUser } = useGlobalStore();
  
  useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const data = await current.getCurrentUser();
      setCurrentUser(data as any);
      return data;
    },
  });

  return (
    <Layout className="flex">
      <Sidebar />
      <Content className="bg-white rounded-2xl">
        <AppHeader />
        <Content className="p-3 ">
          <AnimatePresence mode="wait" key={location.pathname}>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </m.div>
          </AnimatePresence>
        </Content>
      </Content>
    </Layout>
  );
};
export default AppLayout;
