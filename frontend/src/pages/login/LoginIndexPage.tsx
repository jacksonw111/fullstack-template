import auth from "@/api/auth";
import image from "@/assets/image.png";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
interface LoginFormValues {
  email: string;
  password: string;
}

const LoginIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken, access_token } = useGlobalStore();
  if (access_token) {
    navigate("/");
  }
  const onFinish = async (values: LoginFormValues) => {
    try {
      const formData = new FormData();
      formData.append("username", values.email);
      formData.append("password", values.password);

      const response = await auth.login(formData);
      console.log(response);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);

      toast.success("登录成功", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("登录失败:", error);
      toast.error("登录失败，请检查您的邮箱和密码", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 h-screen flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold rounded w-[500px] py-3 my-5 uppercase">
          Welcome Back 🎊
        </h2>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          style={{ width: 500 }}
          className="shadow border p-10 rounded"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入您的邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入您的密码" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="w-1/2 h-screen">
        <img src={image} alt="" className="w-full h-screen" />
      </div>
    </div>
  );
};

export default LoginIndexPage;
