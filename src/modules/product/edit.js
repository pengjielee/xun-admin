import { useRef } from "react";
import { Form, Button, Input, Radio, Modal } from "antd";
import { CloseSquareOutlined } from "@ant-design/icons";
import { Uploader } from "@/components";
import withEdit from "@/modules/withEdit";

const { confirm } = Modal;

function Products(props) {
  const { form } = props;

  const uploadRef = useRef();

  const handleUploaderChange = (fileUrl) => {
    const idx = uploadRef.current;
    const products = [].concat(form.getFieldsValue().products);
    products[idx].image = fileUrl;
    const data = Object.assign({}, { products: products });
    form.setFieldsValue(data);
  };

  const handleAdd = () => {
    const products = [].concat(form.getFieldsValue().products || []);
    products.push({
      title: "",
      tag: "",
      image: "",
      description: "",
      originalPrice: "",
      currentPrice: "",
    });
    const data = Object.assign({}, { products: products });
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
      <Form.Item name="align" label="商品展示方式">
        <Radio.Group>
          <Radio value="1">一行一个【图片宽高：120*110】</Radio>
          <Radio value="2">一行两个【图片宽高：163*163】</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.List name="products">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div key={key}>
                <fieldset className="form-fieldset image-fieldset">
                  <legend>商品{index + 1}</legend>
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
                    label="产品标题"
                    name={[name, "title"]}
                    fieldKey={[fieldKey, "title"]}
                    rules={[{ required: true, message: "请填写产品标题" }]}
                  >
                    <Input maxLength={20} placeholder="最长20个字符" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="产品链接"
                    name={[name, "href"]}
                    fieldKey={[fieldKey, "href"]}
                    rules={[{ required: true, message: "请填写产品链接" }]}
                  >
                    <Input type="url" placeholder="产品链接" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="产品图片"
                    name={[name, "image"]}
                    fieldKey={[fieldKey, "image"]}
                    rules={[{ required: true, message: "请上传产品图片" }]}
                  >
                    <Input placeholder="产品图片" />
                  </Form.Item>

                  <div
                    className="upload-control"
                    onClick={() => (uploadRef.current = index)}
                  >
                    <Uploader onChange={handleUploaderChange} />
                  </div>

                  <Form.Item
                    {...restField}
                    label="产品图片描述信息（用于SEO）"
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    rules={[
                      { required: true, message: "请填写产品图片描述信息" },
                    ]}
                  >
                    <Input placeholder="产品图片描述信息" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="产品标签"
                    name={[name, "tag"]}
                    fieldKey={[fieldKey, "tag"]}
                  >
                    <Input maxLength={10} placeholder="最长10个字符" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="产品原价"
                    name={[name, "originalPrice"]}
                    fieldKey={[fieldKey, "originalPrice"]}
                  >
                    <Input placeholder="产品原价" style={{ width: "150px" }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="产品现价"
                    name={[name, "currentPrice"]}
                    fieldKey={[fieldKey, "currentPrice"]}
                    rules={[{ required: true, message: "请填写产品现价" }]}
                  >
                    <Input placeholder="商品现价" style={{ width: "150px" }} />
                  </Form.Item>
                </fieldset>
              </div>
            ))}
            <Form.Item>
              <Button onClick={() => handleAdd(add)}>添加商品</Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}

export default withEdit(Products);
