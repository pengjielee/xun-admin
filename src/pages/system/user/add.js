import React from "react";
import { useRouter } from "next/router";
import { Header } from "@/components";
import { Input, Button, Form, message } from "antd";
import { userApi } from "@/services/index";

const Add = () => {
  const router = useRouter();
  const onFinish = (values) => {
    userApi
      .add({
        ...values,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("添加成功");
          router.replace("/user/list");
        }
      });
  };

  return (
    <div className="page-user-add">
      <Header title="User Add"></Header>

      <main>
        <Form layout="vertical" initialValues={{}} onFinish={onFinish}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input maxLength={20} placeholder="最多20个字符" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button className="btn-back" onClick={() => router.back()}>
              返回
            </Button>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
};

export default Add;
