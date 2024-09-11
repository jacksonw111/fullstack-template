import { RoleBase } from "@/api/role";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  Form,
  Input,
  Select,
} from "antd";
import React, { useState } from "react";

interface RoleFormProps {
  onSubmit: (values: RoleBase) => void;
  initialValues?: RoleBase;
}

const { Option } = Select;

const RoleForm: React.FC<RoleFormProps> = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const [checkedList, setCheckedList] = useState<string[]>(
    initialValues?.permissions || []
  );
  const allPermissions = [
    "dashboard:view",
    "dashboard:add",
    "dashboard:update",
    "dashboard:delete",
    "user:view",
    "user:add",
    "user:update",
    "user:delete",
    "role:view",
    "role:add",
    "role:update",
    "role:delete",
    "role:permission:view",
    "role:permission:add",
    "role:permission:delete",
  ];
  const checkAll = allPermissions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < allPermissions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
    form.setFieldsValue({ permissions: list });
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    const list = e.target.checked ? allPermissions : [];
    setCheckedList(list);
    form.setFieldsValue({ permissions: list });
  };

  const handleSubmit = (values: RoleBase) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="角色名称"
        rules={[{ required: true, message: "请输入角色名称" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="permissions"
        label="权限"
        rules={[{ required: true, message: "请选择至少一个权限" }]}
      >
        <>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
          <Divider />
          <Checkbox.Group
            options={allPermissions}
            value={checkedList}
            onChange={onChange}
          />
        </>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? "更新角色" : "创建角色"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
