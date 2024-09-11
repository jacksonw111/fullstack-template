import { Modal } from "antd";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "~api/auth";
import { useGlobalStore } from "~stores/useGlobalStore";
const Logout = () => {
  const [open, setOpen] = useState(false);
  const { setAccessToken, setRefreshToken, access_token, refresh_token } =
    useGlobalStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout(access_token!, refresh_token!).then(() => {
      setOpen(true);
      setAccessToken(undefined);
      setRefreshToken(undefined);
      navigate("/login");
    });
  };
  return (
    <div>
      <div
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 justify-center"
      >
        <LogOut size={16} />
        Logout
      </div>
      <Modal
        title="logout"
        open={open}
        onOk={() => {}}
        onCancel={() => setOpen(false)}
      >
        <div>Are you sure to logout?</div>
      </Modal>
    </div>
  );
};
export default Logout;
