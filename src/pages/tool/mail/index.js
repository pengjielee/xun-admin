import React, { useRef } from "react";
import { Header } from "@/components";
import { Input, Button, Form } from "antd";
import Script from "next/script";
import aboutusImg from "@/images/aboutus.png";
import addressImg from "@/images/address.png";
import phoneImg from "@/images/phone.png";
import mobileImg from "@/images/mobile.png";
import mailImg from "@/images/mail.png";

const APP_WIDTH = 408;
const APP_HEIGHT = 353;

const drawAboutUs = () => {
  const image = PIXI.Sprite.from(aboutusImg.src);
  image.x = 0;
  image.y = APP_HEIGHT - 135;
  return image;
};

const drawHeaderLeft = (values) => {
  const { fullname, position } = values;

  let rectangle = new PIXI.Graphics();
  rectangle.beginFill(0x383838);
  rectangle.drawRect(0, 0, APP_WIDTH / 2, 88);
  rectangle.endFill();

  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fill: ["#ffffff"],
    wordWrap: true,
    wordWrapWidth: APP_WIDTH / 2,
    lineHeight: 18,
  });
  const text1 = new PIXI.Text(fullname, style);
  text1.position.set(15, 15);
  const text2 = new PIXI.Text(position, style);
  text2.position.set(15, 40);
  rectangle.addChild(text1);
  rectangle.addChild(text2);

  return rectangle;
};

const drawHeaderRight = (values) => {
  const companyName = values.companyName || "";

  let rectangle = new PIXI.Graphics();
  rectangle.beginFill(0xa61d33);
  rectangle.drawRect(APP_WIDTH / 2, 0, APP_WIDTH / 2, 88);
  rectangle.endFill();

  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fill: ["#ffffff"],
    wordWrap: true,
    wordWrapWidth: APP_WIDTH / 2,
  });
  const text = new PIXI.Text(companyName, style);
  text.position.set(APP_WIDTH - text.width - 20, 88 / 2 - text.height / 2);
  rectangle.addChild(text);

  return rectangle;
};

const drawContact = (values) => {
  const { mobile, telphone, email, companyAddress } = values;

  const y = APP_HEIGHT - 135 - 130;

  let rectangle = new PIXI.Graphics();
  rectangle.beginFill(0xeeeeee);
  rectangle.drawRect(0, y, APP_WIDTH, 130);
  rectangle.endFill();

  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fill: ["#222222"],
    wordWrap: true,
    wordWrapWidth: 440,
  });

  const text1 = new PIXI.Text(companyAddress, style);
  const text2 = new PIXI.Text(email, style);
  const text3 = new PIXI.Text(mobile, style);
  const text4 = new PIXI.Text(telphone, style);

  const icon1 = PIXI.Sprite.from(addressImg.src);
  const icon2 = PIXI.Sprite.from(mailImg.src);
  const icon3 = PIXI.Sprite.from(mobileImg.src);
  const icon4 = PIXI.Sprite.from(phoneImg.src);

  icon1.position.set(10, y + 20);
  text1.position.set(30, y + 20);

  icon2.position.set(10, y + 45);
  text2.position.set(30, y + 45);

  icon3.position.set(10, y + 70);
  text3.position.set(30, y + 70);

  icon4.position.set(10, y + 95);
  text4.position.set(30, y + 95);

  rectangle.addChild(text1);
  rectangle.addChild(text2);
  rectangle.addChild(text3);
  rectangle.addChild(text4);
  rectangle.addChild(icon1);
  rectangle.addChild(icon2);
  rectangle.addChild(icon3);
  rectangle.addChild(icon4);

  return rectangle;
};

const App = () => {
  const rightRef = useRef(null);

  let app = null;

  const onFinish = (values) => {
    console.log(PIXI);

    app = new PIXI.Application({
      width: APP_WIDTH,
      height: APP_HEIGHT,
      transparent: true,
      forceCanvas: true,
    });
    const part1 = drawHeaderLeft(values);
    const part2 = drawHeaderRight(values);
    const part3 = drawContact(values);
    const part4 = drawAboutUs(values);
    app.stage.addChild(part1);
    app.stage.addChild(part2);
    app.stage.addChild(part3);

    app.stage.addChild(part4);
    rightRef.current.innerHTML = "";
    rightRef.current.appendChild(app.view);
  };

  const handleSave = () => {
    if (app) {
      const link = document.createElement("a");
      link.download = "download.png";
      link.href = app.view.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="page-tool-mail">
      <Header title="生成邮箱签名">
        <Script src="https://cdn.bootcdn.net/ajax/libs/pixi.js/4.7.1/pixi.min.js"></Script>
      </Header>
      <h1 className="title">生成邮箱签名</h1>

      <div className="container">
        <div className="left">
          <Form
            layout="vertical"
            initialValues={{
              fullname: "肖静",
              position: "集团市场部经理 Manager of Marketing  Department",
              companyName: "新世纪北京儿童医院",
              companyAddress: "北京市朝阳区安苑路18号",
              email: "386276251@qq.com",
              mobile: "18614023234",
              telphone: "010-6567483",
            }}
            onFinish={onFinish}
          >
            <Form.Item
              label="姓名"
              name="fullname"
              rules={[{ required: true, message: "请输入姓名" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="职位"
              name="position"
              rules={[{ required: true, message: "请输入职位" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="单位名称"
              name="companyName"
              rules={[{ required: true, message: "请输入单位名称" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="单位地址"
              name="companyAddress"
              rules={[{ required: true, message: "请输入单位地址" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="邮箱地址"
              name="email"
              rules={[{ required: true, message: "请输入邮箱地址" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="手机号码"
              name="mobile"
              rules={[{ required: true, message: "请输入手机号码" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="座机号码"
              name="telphone"
              rules={[{ required: true, message: "请输入座机号码" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                生成签名图片
              </Button>
              <Button style={{ marginLeft: "10px" }} onClick={handleSave}>
                保存到本地
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right" ref={rightRef}></div>
      </div>
    </div>
  );
};

export default App;
