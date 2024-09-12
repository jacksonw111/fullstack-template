import user, { UserCreate, UserUpdate } from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import UserForm from "./UserForm";

const UserAdd = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const createUserMutation = useMutation({
    mutationFn: (newUser: UserCreate) => user.createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("用户创建成功", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsModalVisible(false);
    },
    onError: (error) => {
      toast.error(`创建用户失败: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const handleSubmit = (values: UserCreate) => {
    createUserMutation.mutate(values);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        icon={<UserPlusIcon size={16} />}
      >
        Add User
      </Button>
      <Modal
        title="Add User"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <UserForm
          onSubmit={handleSubmit as (values: UserCreate | UserUpdate) => void}
        />
      </Modal>
    </>
  );
};

export default UserAdd;
