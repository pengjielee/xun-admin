import { Header } from "@/components";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Form,
  Select,
  Input,
  Divider,
  Button,
  Table,
  Modal,
  message,
} from "antd";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";
import { fileApi } from "@/services/index";

export default function Index({ models }) {
  const router = useRouter();

  const handleCopy = (url) => {
    copy(url);
    message.success("链接已复制");
  };

  const handleRemove = (id) => {
    Modal.confirm({
      title: "",
      content: "确认删除",
      onOk() {
        fileApi.remove(id).then((res) => {
          if (res.code === 200) {
            window.location.reload();
          }
        });
      },
    });
  };

  const columns: ColumnProps<any>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: "220px",
    },
    {
      title: "图片",
      dataIndex: "url",
      render: (text) => {
        return (
          <>
            <img width="100" src={text} />
          </>
        );
      },
    },
    {
      title: "创建日期",
      dataIndex: "create_date",
      render: (text) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      width: "200px",
    },
    {
      title: "操作",
      fixed: "right",
      render: (text, record) => (
        <>
          <a type="link" onClick={() => handleCopy(record.url)}>
            复制链接
          </a>
          <Divider type="vertical" />
          <a type="link" onClick={() => handleRemove(record.id)}>
            删除
          </a>
        </>
      ),
      width: "140px",
    },
  ];

  return (
    <div className="page-file-list">
      <Header title="File List"></Header>

      <main>
        <div style={{ marginBottom: "30px" }}>
          <Button onClick={() => router.push("/file/upload")} type="primary">
            上传图片
          </Button>
        </div>
        <Table
          rowKey={(record) => record.id}
          bordered
          columns={columns}
          dataSource={models}
          scroll={{ x: "max-content" }}
        />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`http://localhost:3001/api/file/list`);

  let models = [];
  const { code, data } = await response.json();
  if (code === 200) {
    models = data.map((item) => {
      const filename = item.url.replace("public/", "");
      item.url = `http://localhost:3000/${filename}`;
      return item;
    });
  }
  return {
    props: { models },
  };
}
