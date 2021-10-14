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
          router.replace("/role/list");
        }
      });
  };

  return (
    <div className="page-role-add">
      <Header title="Role Add"></Header>

      <main>
        <Form layout="vertical" initialValues={{}} onFinish={onFinish}>
          <Form.Item
            label="角色名称"
            name=""
            rules={[{ required: true, message: "请输入角色名称" }]}
          >
            <Input maxLength={20} placeholder="最多20个字符" />
          </Form.Item>

          <Form.Item
            label="角色描述"
            name="desc"
            rules={[{ required: false, message: "请输入角色描述" }]}
          >
            <Input.TextArea rows={4} placeholder="请输入角色描述" />
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
