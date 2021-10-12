import { Header } from "@/components";
import { useState, useRef } from "react";
import { Input, Button, Form } from "antd";
import JsBarcode from "jsbarcode";

const App = () => {
  const [form] = Form.useForm();
  const canvasRef = useRef(null);
  const [downloadable, setDownloadable] = useState(false);

  const onFinish = (values) => {
    JsBarcode(canvasRef.current, values.barcode, {
      format: "CODE128",
      background: "#ffffff",
      lineColor: "#000000",
      margin: 10,
      width: 2,
      height: 100,
      displayValue: true,
      font: "monospace",
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 2,
      fontSize: 20,
    });
    setDownloadable(true);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "barcode";
    a.click();
  };

  return (
    <div className="page-tool-barcode">
      <Header title="生成条形码"></Header>

      <div className="container">
        <div className="left">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="条形码值"
              name="barcode"
              rules={[{ required: true, message: "请输入条形码值" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                生成
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="right">
          <canvas ref={canvasRef}></canvas>
          <br />
          {downloadable ? (
            <Button type="primary" onClick={handleDownload}>
              下载二维码
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
