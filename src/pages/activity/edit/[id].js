import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
  message,
} from "antd";
import {
  PhoneFilled,
  WechatOutlined,
  BgColorsOutlined,
  SettingFilled,
} from "@ant-design/icons";
// import { BasicIcon, ModuleIcon, TimeIcon } from '@/styles/icons';
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import ColorPicker from "rc-color-picker";
import { builtInModules } from "@/modules";
import { Card, Submiting, Uploader } from "@/components";
import { defaultPageConfig, saleSystemOptions } from "@/utils";
import moment from "moment";
import { activityApi } from "@/services";

const Loading = Submiting;
const { Option } = Select;

import "rc-color-picker/assets/index.css";

export default function Index() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { id } = router.query;

  const initialValues = {
    id: "",
    name: "",
    url: "",
    title: "",
    keywords: "",
    description: "",
    config: { ...defaultPageConfig },
  };

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [firstPublishAt, setFirstPublishAt] = useState(null);

  const frameRef = useRef(null);

  useEffect(async () => {
    if (id) {
      getActivityInfo(id);
    }
  }, [id]);

  const getActivityInfo = (id) => {
    setLoading(true);
    activityApi.detail(id).then((res) => {
      if (res.code === 200) {
        const { activity, modules } = res.data;
        const config = activity.config ? JSON.parse(activity.config) : null;
        form.setFieldsValue({ ...activity, config });
        setCards(modules || []);
      }
    });
    setLoading(false);
  };

  const onFinish = async (action) => {
    const values = await form.validateFields();

    const { modules, config, ...rest } = values;

    const data = {
      ...rest,
      config: JSON.stringify(config),
      module_ids: cards.map((item) => item.id).join(","),
    };

    console.log(data);
    activityApi.update(data).then((res) => {
      if (res.code === 200) {
        message.success("保存成功");
      }
    });
  };

  const onFinishFailed = () => {
    message.error("请检查表单填写");
  };

  const handleAddModule = async (item) => {
    const { type, unique } = item;
    const addedModules = cards.map((item) => item.type).join(",");
    if (unique && addedModules.indexOf(type) > -1) {
      message.error(`全局模块${type}只能添加一个`);
      return;
    }

    activityApi
      .addModule({
        type: type,
        name: type,
        activity_id: id,
      })
      .then((res) => {
        if (res.code === 200) {
          message.success("添加模块成功");
          getActivityInfo(id);
        }
      });
  };

  const handleDeleteModule = (module_id) => {
    activityApi.deleteModule({ activity_id: id, id: module_id }).then((res) => {
      if (res.code === 200) {
        setCards(res.data);
      }
    });
  };

  const handleEditModule = (id) => {
    window.open(`/activity/module/${id}`, "_blank");
  };

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [cards]
  );

  const handleColorPickerChange = (color, key) => {
    const formValues = form.getFieldsValue();

    const field = {};
    field[key] = color.color;

    const config = Object.assign({}, formValues.config, field);
    const data = Object.assign({}, formValues, { config: config });
    form.setFieldsValue(data);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value.toLowerCase();
    form.setFieldsValue({ url: url });
  };

  const handleRefresh = () => {
    if (previewUrl) {
      frameRef.current.src = previewUrl;
    }
  };

  const urlValidator = (rule, value) => {
    if (value) {
      value = value.toLowerCase();
      if (value.startsWith("copy")) {
        return Promise.reject(new Error("请修改页面Url，不能以copy开头"));
      }

      if (!/^[0-9a-zA-Z]{1,20}$/g.test(value)) {
        return Promise.reject(new Error("只能输入字母、数字，且长度为20"));
      }
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("请输入页面Url"));
    }
  };

  return (
    <>
      <div className="page-admin page-activity-edit">
        <Head>
          <title>编辑活动</title>
        </Head>
        <div className="activity-form">
          <header className="header">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/activity/list">活动列表</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>编辑活动</Breadcrumb.Item>
            </Breadcrumb>
          </header>
          <Form
            form={form}
            layout="vertical"
            name="basic"
            initialValues={initialValues}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item name="id" hidden={true}>
              <Input />
            </Form.Item>

            <Form.Item
              label="活动名称"
              name="name"
              rules={[{ required: true, message: "请输入活动名称" }]}
            >
              <Input maxLength={20} placeholder="请输入20字内活动名称" />
            </Form.Item>

            <fieldset className="form-fieldset">
              <legend>页面基础信息</legend>
              <Form.Item
                label="页面标题"
                name="title"
                rules={[{ required: true, message: "请输入页面标题" }]}
              >
                <Input maxLength={20} placeholder="请输入20字内标题" />
              </Form.Item>

              <Form.Item
                label="页面Url"
                name="url"
                rules={[
                  {
                    validator: urlValidator,
                  },
                ]}
              >
                <Input
                  placeholder="20个英文字母、数字，最大长度为20"
                  maxLength={20}
                  disabled={firstPublishAt != null}
                  onChange={handleUrlChange}
                />
              </Form.Item>

              <Form.Item
                label="页面关键字"
                name="keywords"
                rules={[{ required: true, message: "请输入页面关键字" }]}
              >
                <Input.TextArea
                  maxLength={50}
                  placeholder="请输入50字内关键字，多个用英文逗号分隔"
                />
              </Form.Item>

              <Form.Item
                label="页面描述信息"
                name="description"
                rules={[{ required: true, message: "请输入页面描述信息" }]}
              >
                <Input.TextArea
                  maxLength={200}
                  placeholder="请输入200字内描述信息"
                />
              </Form.Item>
            </fieldset>

            <fieldset className="form-fieldset">
              <legend>模块配置</legend>

              <Form.Item label="可添加模块">
                <div className="list list-2">
                  {builtInModules.map((item) => {
                    return (
                      <div
                        key={item.type}
                        className="item"
                        onClick={() => handleAddModule(item)}
                      >
                        <div>
                          <span className="name">{item.type + ":"}</span>
                          <span className="name">{item.desc}</span>
                        </div>
                        <div>+</div>
                      </div>
                    );
                  })}
                </div>
              </Form.Item>

              <div className="ant-form-item-label">
                <label>已添加模块（拖动模块即可排序）</label>
              </div>
              {cards.length > 0 ? (
                <DndProvider backend={HTML5Backend}>
                  <div className="list" style={{ width: "100%" }}>
                    {cards.map((card, index) => (
                      <Card
                        key={card.id}
                        index={index}
                        id={card.id}
                        text={card.name}
                        item={card}
                        moveCard={moveCard}
                        editCard={handleEditModule}
                        deleteCard={handleDeleteModule}
                      />
                    ))}
                  </div>
                </DndProvider>
              ) : null}
            </fieldset>

            <fieldset className="form-fieldset">
              <legend>
                <BgColorsOutlined style={{ color: "#FF0033" }} />
                页面配色
              </legend>

              <Form.Item label="页面背景色">
                <div className="row">
                  <Form.Item name={["config", "bgColor"]}>
                    <Input />
                  </Form.Item>
                  <ColorPicker
                    animation="slide-up"
                    color={form.getFieldValue(["config", "bgColor"])}
                    onChange={(color) =>
                      handleColorPickerChange(color, "bgColor")
                    }
                  />
                </div>
              </Form.Item>

              <Form.Item label="页面主题色">
                <div className="row">
                  <Form.Item name={["config", "themeColor"]}>
                    <Input />
                  </Form.Item>
                  <ColorPicker
                    animation="slide-up"
                    color={form.getFieldValue(["config", "themeColor"])}
                    onChange={(color) =>
                      handleColorPickerChange(color, "themeColor")
                    }
                  />
                </div>
              </Form.Item>

              <Form.Item label="文字标题模块配色">
                <div className="row">
                  <Form.Item name={["config", "titleColor"]}>
                    <Input />
                  </Form.Item>
                  <ColorPicker
                    animation="slide-up"
                    color={form.getFieldValue(["config", "titleColor"])}
                    onChange={(color) =>
                      handleColorPickerChange(color, "titleColor")
                    }
                  />
                </div>
              </Form.Item>
            </fieldset>

            <Form.Item label=" ">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={() => onFinish("save")}
              >
                保存
              </Button>
              <br />
            </Form.Item>
          </Form>
        </div>
        <div className="activity-preview" style={{ display: "none " }}>
          <div className="preview-container">
            <header className="preview-header">
              <img
                src="https://of.xmfile.cn/pro/mkt_resource/20210624/6bc16aaf2e8a4039bdd5f2a956a0e0f3.png"
                className="status"
              />
              <div className="name"></div>
            </header>
            {previewUrl ? (
              <iframe
                ref={frameRef}
                width="100%"
                height="600"
                src={previewUrl}
              ></iframe>
            ) : (
              <p className="preview-iframe-placeholder">预览区</p>
            )}

            <div className="btn-refresh">
              <span onClick={() => handleRefresh()}>刷新</span>
            </div>
          </div>
        </div>
      </div>
      {loading ? <Loading /> : null}
      {submiting ? <Submiting /> : null}
    </>
  );
}
