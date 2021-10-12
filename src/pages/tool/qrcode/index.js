import dynamic from "next/dynamic";
import { Header } from "@/components";
import { useState, useRef, useCallback } from "react";
import { Input, InputNumber, Button, Form, Checkbox, message } from "antd";
import QRCode from "qrcode.react";

const SketchPicker = dynamic(import("react-color"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const App = () => {
  const [form] = Form.useForm();
  const [positionVisible, setPositionVisible] = useState(false);
  const [colors, setColors] = useState({
    bgColor: "#FFFFFF",
    fgColor: "#000000",
  });

  const [config, setConfig] = useState({
    url: "",
    size: 128,
    bgColor: colors.bgColor,
    fgColor: colors.fgColor,
    imageSettings: {
      src: "http://localhost:3000/favicon.png",
      width: 24,
      height: 24,
    },
  });

  const handleDownload = () => {
    const canvas = document.getElementById("qrcode");
    if (!canvas) {
      message.error("请先生成二维码");
      return;
    }
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "qrcode";
    a.click();
  };

  const handleFormChange = (changedValues, allValues) => {
    setConfig(allValues);
  };

  const handleColorChange = (color, name) => {
    const temp = {};
    temp[`${name}`] = color.hex;
    form.setFieldsValue(temp);
    setColors(Object.assign({}, colors, temp));
    setConfig(Object.assign({}, config, temp));
  };

  return (
    <div className="page-tool-qrcode">
      <Header title="生成二维码"></Header>

      <div className="container">
        <div className="left">
          <Form
            form={form}
            layout="vertical"
            initialValues={config}
            onValuesChange={handleFormChange}
          >
            <Form.Item
              label="链接"
              name="url"
              rules={[{ required: true, message: "请输入链接" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="尺寸"
              name="size"
              rules={[{ required: true, message: "请输入尺寸" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="背景色"
              name="bgColor"
              rules={[{ required: false, message: "请输入背景色" }]}
            >
              <Input />
            </Form.Item>

            <SketchPicker
              color={colors.bgColor}
              onChange={(color) => handleColorChange(color, "bgColor")}
            />
            <br />

            <Form.Item
              label="前景色"
              name="fgColor"
              rules={[{ required: false, message: "请输入前景色" }]}
            >
              <Input />
            </Form.Item>

            <SketchPicker
              color={colors.fgColor}
              onChange={(color) => handleColorChange(color, "fgColor")}
            />
            <br />

            <fieldset>
              <legend>二维码Logo设置</legend>
              <Form.Item
                label="Logo链接"
                name={["imageSettings", "src"]}
                rules={[{ required: false, message: "请输入前景色" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Logo宽"
                name={["imageSettings", "width"]}
                rules={[{ required: true, message: "请输入Logo宽" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Logo高"
                name={["imageSettings", "height"]}
                rules={[{ required: true, message: "请输入Logo高" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item>
                <Checkbox
                  onChange={(e) => setPositionVisible(e.target.checked)}
                >
                  自定义Logo位置
                </Checkbox>
              </Form.Item>

              {positionVisible ? (
                <>
                  <Form.Item
                    label="Logo横坐标"
                    name={["imageSettings", "x"]}
                    rules={[{ required: false, message: "请输入Logox坐标" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    label="Logo纵坐标"
                    name={["imageSettings", "y"]}
                    rules={[{ required: false, message: "请输入图片y坐标" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </>
              ) : null}
            </fieldset>
            <br />

            <Form.Item>
              <Button type="primary" onClick={handleDownload}>
                下载二维码
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right">
          {config.url ? (
            <QRCode
              id="qrcode"
              value={config.url}
              size={config.size}
              fgColor={config.fgColor}
              bgColor={config.bgColor}
              style={{ margin: "auto" }}
              imageSettings={config.imageSettings}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
