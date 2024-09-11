import { createRole, RoleCreate } from "@/api/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleForm from "./RoleForm";

const RoleAdd: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createRoleMutation = useMutation({
    mutationFn: (newRole: RoleCreate) => createRole(newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      message.success("角色创建成功");
      setIsModalVisible(false);
    },
    onError: (error) => {
      message.error(`创建角色失败: ${error.message}`);
    },
  });

  const handleSubmit = (values: RoleCreate) => {
    createRoleMutation.mutate(values);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary">
        添加角色
      </Button>
      <Modal
        title="添加角色"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <RoleForm onSubmit={handleSubmit} />
      </Modal>
    </>
  );
};

export default RoleAdd;
