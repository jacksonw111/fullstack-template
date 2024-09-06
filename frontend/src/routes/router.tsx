import { antdUtils } from "@/utils/antdUtil";
import { App } from "antd";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from ".";

const RouterProviderComponent = () => {
  const { notification, message, modal } = App.useApp();

  useEffect(() => {
    antdUtils.setMessageInstance(message);
    antdUtils.setNotificationInstance(notification);
    antdUtils.setModalInstance(modal);
  }, [notification, message, modal]);

  return <RouterProvider router={router} />;
};
export default RouterProviderComponent;
