import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Form, Input, Button, Checkbox, message as Toast } from "antd";
import { login } from "@/services/user";

const Login: NextPage = () => {
  const router = useRouter();

  const onFinish = (values: any) => {
    login(values).then((res) => {
      const { code, message } = res;
      if (code === 200) {
        Toast.success("登录成功");
        router.replace("/");
      } else {
        Toast.error(message || "登录失败");
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    Toast.error(errorInfo || "登录失败");
  };

  const pageTitle = "用户登录";

  return (
    <div className="page page-user-login">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta name="keywords" content="" />
        <meta name="description" content="" />
        <title>{pageTitle}</title>
      </Head>

      <main>
        <header className="header">
          <h2>{pageTitle}</h2>
        </header>
        <Form
          className="login-form"
          name="login-form"
          labelCol={{ span: 4 }}
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 0, span: 16 }}
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <div className="action">
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </div>

          <div className="note">
            还没有账号，去
            <Link href="/user/register">
              <a>注册</a>
            </Link>
          </div>
        </Form>
      </main>
    </div>
  );
};

Login.layout = "fullpage";

export default Login;
