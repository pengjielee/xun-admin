import React, { useState } from "react";
import { Form, Input, Button, Radio, Modal, Switch } from "antd";
import { CloseSquareOutlined } from "@ant-design/icons";
import { Uploader } from "@/components";
import withEdit from "@/modules/withEdit";
const { confirm } = Modal;

import "antd/dist/antd.css";

function Forms(props) {
  const { form, moduleData, onPreviewSuccess } = props;

  const [detail, setDetail] = useState(moduleData);

  const handleAdd = (add) => {
    const inputs = [].concat(form.getFieldsValue().inputs || []);
    inputs.push({ label: "", placeholder: "", type: "text", options: "" });
    const data = Object.assign({}, { inputs: inputs });
    form.setFieldsValue(data);
    setDetail(data);
  };

  const handleRemove = (remove, name) => {
    confirm({
      title: "确认删除？",
      async onOk() {
        remove(name);
      },
    });
  };

  const handleRadioChange = (e, index) => {
    const value = e.target.value;
    const inputs = [].concat(form.getFieldsValue().inputs);
    inputs[index].type = value;
    const data = Object.assign({}, { inputs: inputs });
    form.setFieldsValue(data);
    setDetail(data);
  };

  const handleQrImgChange = (fileUrl) => {
    const data = Object.assign({}, form.getFieldsValue(), {
      successQrImg: fileUrl,
    });
    form.setFieldsValue(data);
  };

  return (
    <>
      <Form.List name="inputs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div key={key}>
                <fieldset className="form-fieldset">
                  <legend>表单项{index + 1}</legend>
                  <div
                    className="action"
                    onClick={() => handleRemove(remove, name)}
                  >
                    <CloseSquareOutlined
                      style={{
                        fontSize: "20px",
                        color: "#ddd",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <Form.Item
                    {...restField}
                    label="输入框标题"
                    name={[name, "label"]}
                    fieldKey={[fieldKey, "label"]}
                    rules={[{ required: true, message: "请填写输入框标题" }]}
                  >
                    <Input placeholder="输入框标题" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="输入框默认展示内容"
                    name={[name, "placeholder"]}
                    fieldKey={[fieldKey, "placeholder"]}
                  >
                    <Input placeholder="输入框默认展示内容" />
                  </Form.Item>
                  <Form.Item name={[name, "type"]} label="输入框类型">
                    <Radio.Group onChange={(e) => handleRadioChange(e, index)}>
                      <Radio value="text">文本框</Radio>
                      <Radio value="date">日期选择</Radio>
                      <Radio value="select">下拉选择框</Radio>
                      <Radio value="radio">是否选择框</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {detail.inputs[index].type === "select" ? (
                    <Form.Item
                      {...restField}
                      label="下拉选择值"
                      name={[name, "options"]}
                      fieldKey={[fieldKey, "options"]}
                      rules={[{ required: false, message: "请填写下拉选择值" }]}
                    >
                      <Input placeholder="下拉选择值，多个值用英文逗号分割" />
                    </Form.Item>
                  ) : null}
                </fieldset>
              </div>
            ))}
            <Form.Item>
              <Button onClick={() => handleAdd()}>添加表单项</Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item
        label="表单提交按钮文案"
        name="submitBtnText"
        rules={[{ required: true, message: "表单提交按钮文案" }]}
      >
        <Input />
      </Form.Item>

      <fieldset className="form-fieldset">
        <legend>表单提交成功页定制</legend>
        <Form.Item label="标题" name={["successTitle"]}>
          <Input />
        </Form.Item>
        <Form.Item label="内容" name={["successContent"]}>
          <Input.TextArea maxLength={100} placeholder="最长100个字符" />
        </Form.Item>
        <Form.Item label="二维码图（114*114）" name={["successQrImg"]}>
          <Input />
        </Form.Item>
        <Uploader onChange={(e) => handleQrImgChange(e)} />
        <Form.Item label="返回按钮文案" name={["successBtnText"]}>
          <Input />
        </Form.Item>
        <Form.Item label="返回按钮链接" name={["successBtnHref"]}>
          <Input />
        </Form.Item>

        <div className="preview-success">
          <Switch onChange={(checked) => onPreviewSuccess(checked)} />{" "}
          &nbsp;&nbsp;预览表单成功页
        </div>
      </fieldset>
    </>
  );
}

export default withEdit(Forms);
