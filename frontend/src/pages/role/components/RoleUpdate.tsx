import { getRole, RoleUpdate as RoleUpdateType, updateRole } from "@/api/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal, Skeleton } from "antd";
import { useState } from "react";
import RoleForm from "./RoleForm";

const RoleUpdate = ({ roleId }: { roleId: string }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationFn: (updatedRole: RoleUpdateType) =>
      updateRole(roleId, updatedRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      message.success("角色更新成功");
      setIsModalVisible(false);
    },
    onError: (error) => {
      message.error(`更新角色失败: ${error.message}`);
    },
  });

  const handleSubmit = (values: RoleUpdateType) => {
    updateRoleMutation.mutate(values);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { data: initialData, isLoading } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRole(roleId),
    enabled: isModalVisible,
  });
  console.log(initialData);

  return (
    <>
      <Button onClick={showModal} type="primary">
        更新角色
      </Button>
      <Modal
        title="更新角色"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {isLoading ? (
          <Skeleton paragraph={{ rows: 5 }} />
        ) : (
          <RoleForm onSubmit={handleSubmit} initialValues={initialData?.data} />
        )}
      </Modal>
    </>
  );
};

export default RoleUpdate;
