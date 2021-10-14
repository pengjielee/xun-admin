import React from "react";
import { useRouter } from "next/router";
import { Header } from "@/components";
import { Input, Button, Form, message } from "antd";
import { rightsApi } from "@/services/index";

const Add = () => {
  const router = useRouter();
  const onFinish = (values) => {
    rightsApi
      .add({
        ...values,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("添加成功");
          router.replace("/rights/list");
        }
      });
  };

  return (
    <div className="page-rights-add">
      <Header title="Rights Add"></Header>

      <main>
        <Form layout="vertical" initialValues={{}} onFinish={onFinish}>
          <Form.Item
            label="权限名称"
            name="name"
            rules={[{ required: true, message: "请输入权限名称" }]}
          >
            <Input maxLength={20} placeholder="最多20个字符" />
          </Form.Item>

          <Form.Item
            label="权限描述"
            name="desc"
            rules={[{ required: false, message: "请输入权限描述" }]}
          >
            <Input.TextArea rows={4} placeholder="请输入权限描述" />
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
