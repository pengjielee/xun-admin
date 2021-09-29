import { useState } from "react";
import { Form, Input, Radio } from "antd";
import { Uploader } from "@/components/";
import withEdit from "@/modules/withEdit";
import { effectOptions } from "@/utils";

function Banner(props) {
  const { form, moduleData } = props;

  const required = form.getFieldValue("effect") === "link" || false;

  const [linkRequired, setLinkRequired] = useState(required);
  const [detail, setDetail] = useState(moduleData);

  const handleUploaderChange = (fileUrl) => {
    const values = Object.assign({}, form.getFieldsValue(), { image: fileUrl });
    form.setFieldsValue(values);
    setDetail(values);
  };

  const handleRadioChange = (e) => {
    setLinkRequired(e.target.value === "link");
  };

  return (
    <>
      <Form.Item
        label="图片地址"
        name="image"
        rules={[{ required: true, message: "请输入图片链接" }]}
      >
        <Input />
      </Form.Item>
      <Uploader previewImg={detail.image} onChange={handleUploaderChange} />
      <br />
      <Form.Item
        label="图片描述信息（用于SEO）"
        name="alt"
        rules={[{ required: true, message: "请输入图片描述信息" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="effect" label="触发功能">
        <Radio.Group onChange={(e) => handleRadioChange(e)}>
          {effectOptions.map((item) => {
            return (
              <Radio key={item.id} value={item.value}>
                {item.text}
              </Radio>
            );
          })}
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="图片超链接"
        name="href"
        rules={[{ required: linkRequired, message: "请输入图片超链接" }]}
      >
        <Input type="url" />
      </Form.Item>
    </>
  );
}

export default withEdit(Banner);
