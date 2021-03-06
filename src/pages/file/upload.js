import React from "react";
import { useRouter } from "next/router";
import { Header, Uploader } from "@/components";
import { Row, Col, message } from "antd";

const Add = () => {
  const router = useRouter();

  const handleChange = (res) => {
    if (res.code === 200) {
      message.success("上传成功");
      router.replace("/file/list");
    }
  };

  return (
    <div className="page-file-upload">
      <Header title=""></Header>

      <main>
        <div className="container">
          <Row gutter={[20, 20]}>
            <Col span={6}>
              <div className="card">
                <h1>单张图片上传</h1>
                <Uploader onChange={handleChange} />
              </div>
            </Col>
            <Col span={6}>
              <div className="card">
                <h1>多张图片上传</h1>
                <Uploader multipie onChange={handleChange} />
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
};

export default Add;
