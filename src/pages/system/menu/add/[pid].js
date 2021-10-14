import React from "react";
import { useRouter } from "next/router";
import { Header } from "@/components";
import { Input, Button, Form, message } from "antd";
import { menuApi } from "@/services/index";

const Add = () => {
  const router = useRouter();
  const parent_id = router.query.pid || 0;

  const onFinish = (values) => {
    menuApi
      .add({
        ...values,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("添加成功");
          router.replace("/system/menu/list");
        }
      });
  };

  return (
    <div className="page-menu-add">
      <Header title="Menu Add"></Header>

      <main>
        <Form
          layout="vertical"
          initialValues={{
            parent_id: parent_id,
            icon: "",
          }}
          onFinish={onFinish}
        >
          <Form.Item hidden name="parent_id">
            <Input />
          </Form.Item>

          <Form.Item
            label="菜单名称"
            name="name"
            rules={[{ required: true, message: "请输入菜单名称" }]}
          >
            <Input maxLength={20} placeholder="最多20个字符" />
          </Form.Item>

          <Form.Item
            label="菜单路径"
            name="desc"
            rules={[{ required: true, message: "请输入菜单路径" }]}
          >
            <Input placeholder="请输入菜单路径" />
          </Form.Item>

          <Form.Item
            label="菜单图标"
            name="icon"
            rules={[{ required: false, message: "请输入菜单图标" }]}
          >
            <Input placeholder="请输入菜单图标" />
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
