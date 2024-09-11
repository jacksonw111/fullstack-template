import user, { UserCreate, UserUpdate as UserUpdateType } from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, message } from "antd";
import { UserPenIcon } from "lucide-react";
import { useState } from "react";
import UserForm from "./UserForm";

const UserUpdate = ({
  userId,
  initialData,
}: {
  userId: string;
  initialData: UserUpdateType;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: UserUpdateType) =>
      user.updateUser(userId, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success("用户更新成功");
      setIsModalVisible(false);
    },
    onError: (error) => {
      message.error(`更新用户失败: ${error.message}`);
    },
  });

  const handleSubmit = (values: UserUpdateType) => {
    updateUserMutation.mutate(values);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary" icon={<UserPenIcon size={16}/>}>
        Update User
      </Button>
      <Modal
        title="更新用户"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <UserForm
          onSubmit={
            handleSubmit as (values: UserCreate | UserUpdateType) => void
          }
          initialValues={{
            ...initialData,
            current_role_id: initialData.role.id,
          }}
          isUpdate
        />
      </Modal>
    </>
  );
};

export default UserUpdate;
