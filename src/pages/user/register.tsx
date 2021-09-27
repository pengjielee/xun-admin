import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Form, Input, Button, message as Toast } from "antd";
import { register } from "@/services/user";

const Register: NextPage = () => {
  const router = useRouter();

  const onFinish = (values: any) => {
    register(values).then((res) => {
      const { code, message } = res;
      if (code === 200) {
        Toast.success("注册成功");
        router.replace("/user/login");
      } else {
        Toast.error(message || "注册失败");
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    Toast.error(errorInfo || "注册失败");
  };

  return (
    <div className="page page-user-register">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta name="keywords" content="" />
        <meta name="description" content="" />
        <title>用户注册</title>
      </Head>

      <main>
        <header className="header">
          <h2>用户注册</h2>
        </header>
        <Form
          className="register-form"
          name="register-form"
          labelCol={{ span: 4 }}
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 5, message: "最少5个字符" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "最少6个字符" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="action">
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </div>

          <div className="note">
            已经有账号，去
            <Link href="/user/login">
              <a>登录</a>
            </Link>
          </div>
        </Form>
      </main>
    </div>
  );
};

Register.layout = "fullpage";

export default Register;
