import { useRef } from "react";
import { Form, Input, Button, Radio, Modal } from "antd";
import { CloseSquareOutlined } from "@ant-design/icons";

import { Uploader } from "@/components";
import withEdit from "@/modules/withEdit";
import { effectOptions } from "@/utils";

const { confirm } = Modal;

function Images(props) {
  const { form, moduleData } = props;
  const uploadRef = useRef();

  const handleUploaderChange = (fileUrl) => {
    const idx = uploadRef.current;
    const images = [].concat(form.getFieldsValue().images);
    images[idx].src = fileUrl;
    const data = Object.assign({}, { images: images });
    form.setFieldsValue(data);
  };

  const handleAdd = () => {
    const images = [].concat(form.getFieldsValue().images || []);
    images.push({ src: "", href: "", alt: "", effect: "nothing" });
    const data = Object.assign({}, { images: images });
    form.setFieldsValue(data);
  };

  const handleRemove = (remove, name) => {
    confirm({
      title: "确认删除？",
      async onOk() {
        remove(name);
      },
    });
  };

  return (
    <>
      <Form.Item name="align" label="图片排列方式">
        <Radio.Group>
          <Radio value="1">一行一列</Radio>
          <Radio value="2">一行两列</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.List name="images">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div key={key}>
                <fieldset className="form-fieldset image-fieldset">
                  <legend>图片{index + 1}</legend>
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
                    label="图片地址"
                    name={[name, "src"]}
                    fieldKey={[fieldKey, "src"]}
                    rules={[{ required: true, message: "请上传图片" }]}
                  >
                    <Input placeholder="图片地址" />
                  </Form.Item>
                  <div
                    className="upload-control"
                    onClick={() => (uploadRef.current = index)}
                  >
                    <Uploader onChange={handleUploaderChange} />
                  </div>
                  <Form.Item
                    {...restField}
                    label="图片描述信息（用于SEO）"
                    name={[name, "alt"]}
                    fieldKey={[fieldKey, "alt"]}
                    rules={[{ required: true, message: "请输入图片描述信息" }]}
                  >
                    <Input placeholder="图片描述信息" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="触发功能"
                    name={[name, "effect"]}
                    fieldKey={[fieldKey, "effect"]}
                  >
                    <Radio.Group>
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
                    {...restField}
                    label="图片跳转链接"
                    name={[name, "href"]}
                    fieldKey={[fieldKey, "href"]}
                    rules={[{ required: false, message: "请输入图片跳转链接" }]}
                  >
                    <Input type="url" placeholder="图片跳转链接" />
                  </Form.Item>
                </fieldset>
              </div>
            ))}
            <Form.Item>
              <Button onClick={() => handleAdd(add)}>添加图片</Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}

export default withEdit(Images);
