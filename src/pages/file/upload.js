import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Header, Uploader } from "@/components";
import { Input, Button, Row, Col, Form, message } from "antd";

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
                <h1>单张上传图片</h1>
                <Uploader onChange={handleChange} />
              </div>
            </Col>
            <Col span={6}>
              <div className="card">
                <h1>多张上传图片</h1>
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
