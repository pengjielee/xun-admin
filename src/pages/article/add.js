import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Header, Editor } from "@/components";
import { Input, Button, Form, message } from "antd";
import { articleApi } from "@/services/index";

const Add = () => {
  const router = useRouter();
  const onFinish = (values) => {
    articleApi
      .add({
        ...values,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("添加成功");
          router.replace("/article/list");
        }
      });
  };

  return (
    <div className="page-article-add">
      <Header title="Article Add"></Header>

      <main>
        <Form layout="vertical" initialValues={{}} onFinish={onFinish}>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入内容" }]}
          >
            <Editor height={300} />
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
