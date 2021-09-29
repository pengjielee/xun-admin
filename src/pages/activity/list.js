import { useEffect, useState } from "react";
import {
  Form,
  Breadcrumb,
  Button,
  Table,
  Select,
  Input,
  Modal,
  Divider,
  message,
} from "antd";
import { useRouter } from "next/router";
import {
  getActivityList,
  changeActivityStatus,
  copyActivity,
} from "@/services/activity";
import Head from "next/head";
import Link from "next/link";
import copy from "copy-to-clipboard";
import { Header } from "@/components";
import { activityApi } from "@/services";

import { getPreviewHost, activityStatusOptions } from "@/utils";

const { Option } = Select;
const { confirm } = Modal;
import "antd/dist/antd.css";

export default function Index({ list }) {
  const router = useRouter();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    status: "",
    page_no: 1,
    page_size: 10,
  });
  const [reload, setReload] = useState(false);

  const columns = [
    {
      title: "活动Id",
      dataIndex: "id",
      key: "id",
      width: "100px",
    },
    {
      title: "活动名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "活动URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "创建时间",
      dataIndex: "create_date",
      key: "create_date",
    },
    {
      title: "更新时间",
      dataIndex: "update_date",
      key: "update_date",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <div>
          {record.status === 0 ? (
            <span className="status published">已上线</span>
          ) : record.status === 1 ? (
            <span className="status updated">待发布</span>
          ) : record.status === 2 ? (
            <span className="status offline">已下线</span>
          ) : (
            "未知"
          )}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render: (text, record) => (
        <div className="actions">
          <span className="action">
            <Link href={`/activity/edit/${record.id}`}>编辑</Link>
          </span>
          <a className="action" onClick={() => handleSee(record)}>
            查看
          </a>
          {record.status === 0 ? (
            <a
              className="action offline"
              onClick={() => handleChangeStatus(record)}
            >
              下线
            </a>
          ) : record.status === 1 ? (
            <a
              className="action publish"
              onClick={() => handleChangeStatus(record)}
            >
              发布
            </a>
          ) : record.status === 2 ? (
            <a
              className="action online"
              onClick={() => handleChangeStatus(record)}
            >
              上线
            </a>
          ) : null}
        </div>
      ),
    },
  ];

  const handleSee = (record) => {
    // window.open(`/activity/preview/${record.id}`, "_blank");
    router.push(`/activity/${record.id}`);
  };

  /*
   * 状态
   * 0，已上线；执行下线；
   * 1，待发布；执行发布；
   * 2，已下线；执行上线；
   */
  const handleChangeStatus = (record) => {
    let { id, status, url } = record;

    let title, op;

    switch (status) {
      case 0:
        title = "确认下线？";
        op = "offline";
        break;
      case 1:
        title = "确认发布？";
        op = "publish";
        break;
      case 2:
        title = "确认上线？";
        op = "publish";
        break;
      default:
        title = "确认？";
        op = "";
    }

    //如果是发布
    if (op == "publish" && url.startsWith("copy")) {
      message.error("请修改页面Url，不能以copy开头");
      return;
    }

    confirm({
      title: title,
      async onOk() {
        try {
          const res = await changeActivityStatus({ id: id, op: op });
          const { code, msg } = res;
          if (code === 200) {
            message.success("操作成功");
            setReload(!reload);
          } else {
            message.error(msg || "操作失败！");
          }
        } catch (e) {
          message.error("出错了！");
        }
      },
    });
  };

  const handleSearch = () => {};

  return (
    <div className="page-admin page-activity-list">
      <Header title="活动列表"></Header>

      <header className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href="/activity/index">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>活动列表</Breadcrumb.Item>
        </Breadcrumb>

        <div className="search-form">
          <Form form={searchForm} initialValues={searchData} layout="inline">
            <Form.Item label="活动名称" name="name">
              <Input />
            </Form.Item>

            <Form.Item name="status" label="活动状态">
              <Select style={{ width: 120 }}>
                <Select.Option key="-1" value="">
                  全部
                </Select.Option>
                {activityStatusOptions.map((item) => (
                  <Option key={item.id} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Button onClick={() => router.push("/activity/add")} type="primary">
          创建活动
        </Button>
      </header>

      <Table
        loading={loading}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={list}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`http://localhost:3001/api/activity/list`);

  let list = [];
  const { code, data } = await response.json();
  if (code === 200) {
    list = data;
  }
  return {
    props: { list },
  };
}
