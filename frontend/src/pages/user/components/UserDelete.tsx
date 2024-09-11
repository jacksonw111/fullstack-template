import user from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, message } from "antd";
import { UserX } from "lucide-react";

interface UserDeleteProps {
  userId: string;
}

const UserDelete: React.FC<UserDeleteProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () => user.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success("用户删除成功");
    },
    onError: (error) => {
      message.error(`删除用户失败: ${error.message}`);
    },
  });

  const handleConfirm = () => {
    deleteUserMutation.mutate();
  };

  return (
    <Popconfirm
      title="删除用户"
      description="您确定要删除这个用户吗？此操作不可逆。"
      onConfirm={handleConfirm}
      okText="确定"
      cancelText="取消"
    >
      <Button danger icon={<UserX size={16} />}>
        删除
      </Button>
    </Popconfirm>
  );
};

export default UserDelete;
