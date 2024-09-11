import { listRoles } from "@/api/role";
import { UserCreate, UserUpdate } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select } from "antd";
import React from "react";

interface UserFormProps {
  initialValues?: Partial<UserCreate>;
  onSubmit: (values: UserCreate | UserUpdate) => void;
  isUpdate?: boolean;
}

const { Option } = Select;

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  isUpdate = false,
}) => {
  const [form] = Form.useForm();

  const { data: roleData, isLoading: isRoleLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => listRoles(),
  });

  if (isRoleLoading) return <div>加载中...</div>;
  console.log(initialValues);

  const handleSubmit = (values: UserCreate | UserUpdate) => {
    onSubmit(values);
  };
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: "请输入姓名" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "请输入有效的邮箱地址" },
        ]}
      >
        <Input />
      </Form.Item>

      {!isUpdate && (
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: "请输入密码" },
            { min: 8, message: "密码长度至少为8个字符" },
          ]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: true, message: "请选择性别" }]}
      >
        <Select>
          <Option value="male">男</Option>
          <Option value="female">女</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="current_role_id"
        label="当前角色"
        rules={[{ required: true, message: "请选择当前角色" }]}
      >
        <Select
          loading={isRoleLoading}
          options={roleData?.data.items.map((role) => ({
            value: role.id,
            label: role.name,
          }))}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isUpdate ? "更新" : "创建"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
