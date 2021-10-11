import { Button, Form, Input } from "antd";
import { Header, Editor } from "@/components";

export default function New() {
  const [form] = Form.useForm();

  const onFinish = () => {};

  return (
    <div className="page-about">
      <Header title="新页面"></Header>

      <main>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="页面标题"
            name="title"
            rules={[{ required: true, message: "请输入页面标题" }]}
          >
            <Input maxLength={20} placeholder="请输入20字内标题" />
          </Form.Item>

          <Form.Item
            label="页面内容"
            name="content"
            rules={[{ required: true, message: "请输入内容" }]}
          >
            <Editor height={300} />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              添加
            </Button>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
}
