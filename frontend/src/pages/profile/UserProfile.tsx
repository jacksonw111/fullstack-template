import { Form, Input, Modal, Select } from "antd";
import { UserRoundPen } from "lucide-react";
import { useState } from "react";
const { Password } = Input;

const UserProfile = () => {
  const [editProfile, setEditProfile] = useState(false);
  const [form] = Form.useForm();
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
        <Form form={form}>
          <Form.Item label="Username">
            <Input />
          </Form.Item>
          <Form.Item label="Email">
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item label="Gender">
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="password">
            <Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UserProfile;
