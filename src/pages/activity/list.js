import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Form, Breadcrumb, Button, Table, Select, Input, message } from "antd";
import dayjs from "dayjs";
import { Header } from "@/components";
import { activityStatusOptions } from "@/utils";
import { activityApi } from "@/services";
import copy from "copy-to-clipboard";

const { Option } = Select;

export default function List() {
  const router = useRouter();
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    activityApi.list().then((res) => {
      if (res.code === 200) {
        setDataSource(res.data);
      }
    });
  }, [reload]);

  const columns = [
    {
      title: "活动ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
    },
    {
      title: "活动名称",
      dataIndex: "draft_name",
      key: "draft_name",
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
      render: (text) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      width: "200px",
    },
    {
      title: "更新时间",
      dataIndex: "update_date",
      key: "update_date",
      render: (text) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      width: "200px",
    },
    {
      title: "首次发布时间",
      dataIndex: "first_publish_date",
      key: "first_publish_date",
      render: (text) => {
        return text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--";
      },
      width: "200px",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <div>
          {record.status === 1 ? (
            <span className="status published">已上线</span>
          ) : record.status === 2 ? (
            <span className="status updated">待发布</span>
          ) : record.status === 3 ? (
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

          {record.status === 1 ? (
            <>
              <a className="action" onClick={() => handleSee(record.id)}>
                查看
              </a>
              <a
                className="action offline"
                onClick={() => handleOffline(record.id)}
              >
                下线
              </a>
            </>
          ) : record.status === 2 ? (
            <>
              <a className="action" onClick={() => handlePreview(record.id)}>
                预览
              </a>
              <a
                className="action publish"
                onClick={() => handlePublish(record.id)}
              >
                发布
              </a>
            </>
          ) : record.status === 3 ? (
            <a
              className="action online"
              onClick={() => handleOnline(record.id)}
            >
              上线
            </a>
          ) : null}
          {record.first_publish_date ? (
            <a className="action" onClick={() => handleCopyUrl(record)}>
              复制链接
            </a>
          ) : null}
        </div>
      ),
    },
  ];

  const handleCopyUrl = (record) => {
    const url = `${window.location.origin}/activity/show/${record.url}`;
    copy(url);
    message.success(`复制成功`);
  };

  const handleSee = (id) => {
    window.open(`/activity/${id}`, "_blank");
  };

  /*
   * 状态
   * 1，已上线；执行下线；
   * 2，待发布；执行发布；
   * 3，已下线；执行上线；
   */
  const handleOnline = (id) => {
    activityApi.online(id).then(() => {
      setReload(!reload);
    });
  };

  const handleOffline = (id) => {
    activityApi.offline(id).then(() => {
      setReload(!reload);
    });
  };

  const handlePublish = (id) => {
    activityApi.publish(id).then(() => {
      setReload(!reload);
    });
  };

  const handleSearch = () => {};

  const handlePreview = (id) => {
    window.open(`/activity/preview/${id}`, "_blank");
  };

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
          <Form form={searchForm} layout="inline">
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
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
