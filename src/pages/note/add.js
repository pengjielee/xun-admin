import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Header } from "@/components";
import { Input, Button, Form, message } from "antd";
import { noteApi } from "@/services/index";

const Add = () => {
  const router = useRouter();
  const onFinish = (values) => {
    noteApi
      .add({
        ...values,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("添加成功");
          router.replace("/note/list");
        }
      });
  };

  return (
    <div className="page-note-add">
      <Header title="Note Add"></Header>

      <main>
        <Form layout="vertical" initialValues={{}} onFinish={onFinish}>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入内容" }]}
          >
            <Input.TextArea
              rows={4}
              maxLength={50}
              placeholder="最多50个字符"
            />
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
