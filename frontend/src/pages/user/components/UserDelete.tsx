import user from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, message } from "antd";
import { UserX } from "lucide-react";
import { toast } from "react-toastify";

interface UserDeleteProps {
  userId: string;
}

const UserDelete: React.FC<UserDeleteProps> = ({ userId }) => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () => user.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("用户删除成功", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: (error) => {
      toast.error(`删除用户失败: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
