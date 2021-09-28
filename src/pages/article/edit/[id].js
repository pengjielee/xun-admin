import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Header, Editor } from "@/components";
import dayjs from "dayjs";
import { Input, Button, Form, message } from "antd";
import { articleApi } from "@/services/index";

const Update = ({ model }) => {
  const { id, title, content } = model;

  const router = useRouter();
  const onFinish = (values) => {
    articleApi
      .update({
        ...values,
        id,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("更新成功");
          router.replace("/article/list");
        }
      });
  };

  return (
    <div className="page-article-update">
      <Header title="Article Update"></Header>

      <main>
        <Form
          layout="vertical"
          initialValues={{ title, content }}
          onFinish={onFinish}
        >
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
            <Editor content={content} />
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

export default Update;

export async function getServerSideProps(req) {
  const { id } = req.params;
  const response = await fetch(`http://localhost:3001/api/article/${id}`);

  let model = null;
  const { code, data } = await response.json();
  if (code === 200) {
    model = data;
  }
  return {
    props: { model },
  };
}
