import { Modal } from "antd";
import { LogOut } from "lucide-react";
import { useState } from "react";
const Logout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setOpen(true)} className="flex items-center gap-2 p-2 justify-center">
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
