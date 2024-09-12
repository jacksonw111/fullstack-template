import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRole } from '@/api/role';
import { toast } from 'react-toastify';

interface RoleDeleteProps {
  roleId: string;
}

const RoleDelete: React.FC<RoleDeleteProps> = ({ roleId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const deleteRoleMutation = useMutation({
    mutationFn: () => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("角色删除成功", {
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
      toast.error(`删除角色失败: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    deleteRoleMutation.mutate();
  };

  return (
    <>
      <Button onClick={showModal} danger>
        删除角色
      </Button>
      <Modal
        title="确认删除"
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <p>您确定要删除这个角色吗？此操作不可逆。</p>
      </Modal>
    </>
  );
};

export default RoleDelete;
