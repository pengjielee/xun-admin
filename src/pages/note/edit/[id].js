import React from "react";
import { useRouter } from "next/router";
import { Header } from "@/components";
import { Input, Button, Form, message } from "antd";
import { noteApi } from "@/services/index";

const Update = ({ model }) => {
  const { id, content } = model;

  const router = useRouter();
  const onFinish = (values) => {
    noteApi
      .update({
        ...values,
        id,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("更新成功");
          router.replace("/note/list");
        }
      });
  };

  return (
    <div className="page-note-update">
      <Header title="Note Update"></Header>

      <main>
        <Form layout="vertical" initialValues={{ content }} onFinish={onFinish}>
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

export default Update;

export async function getServerSideProps(req) {
  const { id } = req.params;
  const response = await fetch(`http://localhost:3001/api/note/${id}`);

  let model = null;
  const { code, data } = await response.json();
  if (code === 200) {
    model = data;
  }
  return {
    props: { model },
  };
}
