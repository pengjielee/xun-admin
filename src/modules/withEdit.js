import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { activityApi } from "@/services";
import { defaultModuleConfig } from "@/utils";
import headerImg from "@/images/header.png";

export default function withEdit(WrappedComponent) {
  return function (props) {
    let { type } = props.moduleData;

    const [previewData, setPreviewData] = useState(props.moduleData);
    const [showSuccess, setShowSuccess] = useState(false);

    const PreviewModule = dynamic(() => import(`../modules/${type}/index`), {
      error: () => <p>error</p>,
    });

    const PreviewSuccess = dynamic(() => import(`../components/Success.js`), {
      error: () => <p>error</p>,
    });

    const defaultConfig = defaultModuleConfig[type]
      ? defaultModuleConfig[type]
      : null;

    const initialValues = {
      ...defaultConfig,
      ...props.moduleData,
    };

    const [form] = Form.useForm();

    const onFinish = async (values) => {
      const { id, name, type, activity_id, ...rest } = values;
      const draft_config = JSON.stringify(rest);
      const data = { id, name, type, activity_id, draft_config };

      activityApi.updateModule(data).then((res) => {
        if (res.code === 200) {
          message.success("更新模块成功");
          setTimeout(function () {
            window.close();
          }, 2000);
        }
      });
    };

    const onValuesChange = () => {
      const data = form.getFieldsValue();
      data.mode = "preview";
      setPreviewData(data);
    };

    return (
      <div className="page-module-edit">
        <div className="module-form">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
          >
            <Form.Item name="id" hidden={true}>
              <Input />
            </Form.Item>

            <Form.Item name="activity_id" hidden={true}>
              <Input />
            </Form.Item>

            <Form.Item label="模块类型" name="type">
              <Input disabled />
            </Form.Item>

            <Form.Item label="模块名称" name="name">
              <Input />
            </Form.Item>

            <WrappedComponent
              form={form}
              moduleData={initialValues}
              onValuesChange={onValuesChange}
              onPreviewSuccess={setShowSuccess}
            />

            <Form.Item>
              <p className="tips">保存成功后窗口将自动关闭</p>
              <Button block type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="module-preview">
          <div className="preview-container">
            <header className="preview-header">
              <Image src={headerImg} alt="" laytout="fill" />
              <div className="name">预览：{previewData.name}</div>
            </header>
            <div className="preview-sandbox">
              <div className="page-activity">
                {showSuccess ? (
                  <PreviewSuccess data={previewData} />
                ) : (
                  <PreviewModule data={previewData} />
                )}
              </div>
            </div>
            <div className="preview-mask"></div>
          </div>
        </div>
      </div>
    );
  };
}
