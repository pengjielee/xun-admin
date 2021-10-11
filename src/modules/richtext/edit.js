import { useState } from "react";
import dynamic from "next/dynamic";
import { Form, Input, Checkbox, message } from "antd";
import { Uploader } from "@/components";
import withEdit from "@/modules/withEdit";
import { fileApi } from "@/services";

const ReactWEditor = dynamic(import("wangeditor-for-react"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const config = {
  height: 500,
  menus: ["bold", "link", "image"],
  showFullScreen: true,
  customUploadImg: function (resultFiles, insertImgFn) {
    const formData = new FormData();
    const file = resultFiles[0];
    const { size } = file || {};
    // 检查文件大小是否超过最大限制
    if (size && size > 1024 * 1024 * 60) {
      message.warning("上传文件超过60M");
      return;
    }

    formData.append("type", 1);
    formData.append("files", file);
    fileApi.upload(formData).then((res) => {
      if (res.isSuccess) {
        insertImgFn(res.model);
      } else {
        message.error("上传出错");
      }
    });
  },
};

function RichText(props) {
  const { moduleData, form, onValuesChange } = props;

  const content = moduleData.content || "";

  const [recommend, setRecommned] = useState(moduleData.isRecommend || false);
  const [detail, setDetail] = useState(moduleData);

  const handleEditorChange = (content) => {
    const values = Object.assign({}, form.getFieldsValue(), {
      content: content,
    });
    form.setFieldsValue(values);
    onValuesChange({ content: content });
  };

  const handleChange = (e) => {
    const values = Object.assign({}, form.getFieldsValue(), {
      isRecommend: e.target.checked,
    });
    form.setFieldsValue(values);
    setRecommned(e.target.checked);
  };

  const handleUploaderChange = (fileUrl) => {
    const values = Object.assign({}, form.getFieldsValue(), {
      recommendImg: fileUrl,
    });
    form.setFieldsValue(values);
    setDetail(values);
  };

  return (
    <>
      <Form.Item className="richtext-editor" label="内容" required={false}>
        <Form.Item
          hidden={true}
          name="content"
          rules={[{ required: true, message: "请输入内容" }]}
          noStyle
        >
          <Input />
        </Form.Item>
        <ReactWEditor
          config={config}
          defaultValue={content}
          onChange={handleEditorChange}
        ></ReactWEditor>
      </Form.Item>

      <Form.Item
        label="是否展示推荐商品"
        required={false}
        name="isRecommend"
        valuePropName="checked"
      >
        <Checkbox onChange={(e) => handleChange(e)}>展示推荐商品</Checkbox>
      </Form.Item>
      {recommend ? (
        <>
          <Form.Item
            label="推荐商品标题"
            name="recommendTitle"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input maxLength={10} placeholder="最长10个字符" />
          </Form.Item>
          <Form.Item
            label="推荐商品描述"
            name="recommendDes"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input maxLength={22} placeholder="最长22个字符" />
          </Form.Item>
          <Form.Item
            label="推荐商品图片"
            name="recommendImg"
            rules={[{ required: true, message: "请上传图片" }]}
          >
            <Input />
          </Form.Item>
          <Uploader
            previewImg={detail.recommendImg}
            onChange={handleUploaderChange}
          />
          <Form.Item
            label="推荐商品链接"
            name="recommendLink"
            rules={[{ required: true, message: "请输入链接" }]}
          >
            <Input type="url" />
          </Form.Item>
          <Form.Item
            label="推荐按钮方案"
            name="recommendBtnText"
            rules={[{ required: true, message: "请填写" }]}
          >
            <Input maxLength={3} placeholder="最长3个字符" />
          </Form.Item>
        </>
      ) : null}
    </>
  );
}

export default withEdit(RichText);
