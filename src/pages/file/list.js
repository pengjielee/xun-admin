import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Divider, Button, Table, Modal, message } from "antd";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";
import { fileApi } from "@/services/index";
import { Header } from "@/components";

export default function Index() {
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    fileApi.list().then((res) => {
      if (res.code === 200) {
        const list = res.data.map((item) => {
          const filename = item.url.replace("public/", "");
          item.url = `http://localhost:3000/${filename}`;
          return item;
        });

        setDataSource(list);
      }
    });
  }, [reload]);

  const handleCopy = (url) => {
    copy(url);
    message.success("链接已复制");
  };

  const handleRemove = (id) => {
    Modal.confirm({
      title: "删除图片",
      content: "确认删除",
      onOk() {
        fileApi.remove(id).then((res) => {
          if (res.code === 200) {
            setReload(!reload);
          }
        });
      },
    });
  };

  const columns = [
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
            <Image alt="" width="200" height="100" src={text} />
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
          dataSource={dataSource}
          scroll={{ x: "max-content" }}
        />
      </main>
    </div>
  );
}

// export async function getServerSideProps() {
//   const response = await fetch(`http://localhost:3001/api/file/list`);

//   let models = [];
//   const { code, data } = await response.json();
//   if (code === 200) {
//     models = data.map((item) => {
//       const filename = item.url.replace("public/", "");
//       item.url = `http://localhost:3000/${filename}`;
//       return item;
//     });
//   }
//   return {
//     props: { models },
//   };
// }
