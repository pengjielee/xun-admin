import { useState } from "react";
import { Breadcrumb, Button, Form, Input, message } from "antd";
import { useRouter } from "next/router";
import { addActivity } from "@/services/activity";
import Head from "next/head";
import Link from "next/link";
import { Submiting, Header } from "@/components";
import { activityApi } from "@/services";

export default function Index() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submiting, setSubmiting] = useState(false);

  const onFinish = async (values) => {
    if (submiting) {
      return;
    }
    setSubmiting(true);
    activityApi
      .add(values)
      .then((res) => {
        if (res.code === 200) {
          message.success("新建活动成功");
          // router.push(`/activity/edit/${model.id}`);
        }
      })
      .finally(() => setSubmiting(false));
  };

  const handleUrlChange = (e) => {
    const url = e.target.value.toLowerCase();
    form.setFieldsValue({ url: url });
  };

  const urlValidator = (rule, value) => {
    if (value) {
      value = value.toLowerCase();
      if (!/^[0-9a-zA-Z]{1,20}$/g.test(value)) {
        return Promise.reject(new Error("只能输入字母、数字，且长度为20"));
      }
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("请输入页面Url"));
    }
  };

  return (
    <div className="page-admin page-activity-add">
      <Header title="新建活动"></Header>

      <header className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href="/activity/list">活动列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>新建活动</Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <main>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="活动名称"
            name="name"
            rules={[{ required: true, message: "请输入活动名称" }]}
          >
            <Input maxLength={20} placeholder="请输入20字内活动名称" />
          </Form.Item>

          <Form.Item
            label="页面标题"
            name="title"
            rules={[{ required: true, message: "请输入页面标题" }]}
          >
            <Input maxLength={20} placeholder="请输入20字内标题" />
          </Form.Item>

          <Form.Item
            label="页面Url"
            required
            name="url"
            rules={[{ validator: urlValidator }]}
          >
            <Input
              placeholder="20个英文字母、数字"
              maxLength={20}
              onChange={handleUrlChange}
            />
          </Form.Item>

          <Form.Item
            label="页面关键字"
            name="keywords"
            rules={[{ required: true, message: "请输入页面关键字" }]}
          >
            <Input.TextArea
              maxLength={100}
              placeholder="请输入100字内关键字，多个用英文逗号分隔"
            />
          </Form.Item>

          <Form.Item
            label="页面描述信息"
            name="description"
            rules={[{ required: true, message: "请输入页面描述信息" }]}
          >
            <Input.TextArea
              maxLength={200}
              placeholder="请输入200字内描述信息"
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              新建
            </Button>
          </Form.Item>
        </Form>
      </main>
      {submiting ? <Submiting /> : null}
    </div>
  );
}
