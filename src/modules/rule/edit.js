import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import withEdit from "@/modules/withEdit";

const ReactWEditor = dynamic(import("wangeditor-for-react"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const config = {
  height: 500,
  menus: ["bold", "list", "foreColor"],
  showFullScreen: true,
};

function Rules(props) {
  const { moduleData, form, onValuesChange } = props;

  const content = moduleData.content || "";

  const handleEditorChange = (content) => {
    const values = Object.assign({}, form.getFieldsValue(), {
      content: content,
    });
    form.setFieldsValue(values);
    onValuesChange({ content: content });
  };

  return (
    <>
      <Form.Item
        label="规则标题"
        name="title"
        rules={[{ required: true, message: "请输入规则标题" }]}
      >
        <Input maxLength={10} placeholder="最长10个字符" />
      </Form.Item>
      <Form.Item className="rules-editor" label="规则内容" required={true}>
        <Form.Item
          hidden={true}
          name="content"
          rules={[{ required: true, message: "请输入规则内容" }]}
          noStyle
        >
          <Input.TextArea />
        </Form.Item>
        <ReactWEditor
          config={config}
          defaultValue={content}
          onChange={handleEditorChange}
        ></ReactWEditor>
      </Form.Item>
    </>
  );
}

export default withEdit(Rules);
