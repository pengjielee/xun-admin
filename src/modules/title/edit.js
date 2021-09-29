import { Form, Input } from "antd";

import withEdit from "@/modules/withEdit";

function Title() {
  return (
    <Form.Item
      label="标题"
      name="title"
      rules={[{ required: true, message: "请输入标题" }]}
    >
      <Input maxLength={20} placeholder="最长20个字符" />
    </Form.Item>
  );
}

export default withEdit(Title);
