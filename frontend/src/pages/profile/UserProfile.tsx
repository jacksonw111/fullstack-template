import { Form, Input, Modal, Select } from "antd";
import { UserRoundPen } from "lucide-react";
import { useState } from "react";
const { Password } = Input;

const UserProfile = (data: any) => {
  const [editProfile, setEditProfile] = useState(false);

  const [form] = Form.useForm(data.current_user);
  const onFinish = () => {
    console.log(form.getFieldsValue());
  };
  return (
    <div>
      <div
        onClick={() => setEditProfile(true)}
        className="flex items-center justify-center p-2 gap-2"
      >
        <UserRoundPen size={16} />
        Profile
      </div>
      <Modal
        title="Profile"
        open={editProfile}
        onCancel={() => setEditProfile(false)}
        destroyOnClose
        onOk={onFinish}
        onClose={() => {
          form.resetFields();
          setEditProfile(false);
        }}
      >
        <Form form={form} labelCol={{ span: 6 }} layout="vertical">
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="电话号码" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Select>
              <Select.Option value="male">男</Select.Option>
              <Select.Option value="female">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UserProfile;
