import { Header } from "@/components";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

export default function Index({ notes }) {
  const router = useRouter();
  const columns: ColumnProps<any>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: "220px",
    },
    {
      title: "内容",
      dataIndex: "content",
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
      title: "最后更新日期",
      dataIndex: "update_date",
      render: (text) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      width: "200px",
    },
    {
      title: "操作",
      fixed: "right",
      render: (text, record) => (
        <Link href={`/note/edit/${record.id}`} className="action">
          编辑
        </Link>
      ),
      width: "70px",
    },
  ];

  return (
    <div className="page-note-list">
      <Header title="Note List"></Header>

      <main>
        <div style={{ marginBottom: "30px" }}>
          <Button onClick={() => router.push("/note/add")} type="primary">
            添加
          </Button>
        </div>
        <Table
          rowKey={(record) => record.id}
          bordered
          columns={columns}
          dataSource={notes}
          scroll={{ x: "max-content" }}
        />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`http://localhost:3001/api/note/list`);

  let notes = [];
  const { code, data } = await response.json();
  if (code === 200) {
    notes = data;
  }
  return {
    props: { notes },
  };
}
