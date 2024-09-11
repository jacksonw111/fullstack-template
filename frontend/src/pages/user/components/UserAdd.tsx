import user, { UserCreate, UserUpdate } from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import UserForm from "./UserForm";

const UserAdd = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const createUserMutation = useMutation({
    mutationFn: (newUser: UserCreate) => user.createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success("用户创建成功");
      setIsModalVisible(false);
    },
    onError: (error) => {
      message.error(`创建用户失败: ${error.message}`);
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
