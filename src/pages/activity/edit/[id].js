import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useEffect, useState, useCallback, useRef } from "react";
import { Breadcrumb, Button, Form, Input, DatePicker, message } from "antd";
import { BgColorsOutlined } from "@ant-design/icons";
import { BasicIcon, ModuleIcon, TimeIcon } from "@/assets/icons";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import ColorPicker from "rc-color-picker";
import moment from "moment";

import { builtInModules } from "@/modules";
import { Card, Submiting, Header } from "@/components";
import { defaultPageConfig } from "@/utils";
import { activityApi } from "@/services";
// import headerImg from "../../../assets/images/header.png";

const Loading = Submiting;

import "rc-color-picker/assets/index.css";

export default function Index() {
  const router = useRouter();
  const { id: activity_id } = router.query;
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState("");
  const frameRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    id: "",
    draft_name: "",
    url: "",
    draft_title: "",
    draft_keywords: "",
    draft_description: "",
    draft_end_date: "",
    draft_end_title: "",
    draft_end_content: "",
    draft_config: { ...defaultPageConfig },
  };

  const getActivityInfo = () => {
    if (!activity_id) {
      return;
    }

    setLoading(true);
    activityApi.draft(activity_id).then((res) => {
      if (res.code === 200) {
        const { activity, modules } = res.data;
        const draft_config = activity.draft_config
          ? JSON.parse(activity.draft_config)
          : defaultPageConfig;
        const draft_end_date = activity.draft_end_date
          ? moment(activity.draft_end_date)
          : "";
        form.setFieldsValue({ ...activity, draft_end_date, draft_config });
        setCards(modules || []);
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    getActivityInfo();
  }, []);

  const onFinish = async (action) => {
    const values = await form.validateFields();

    const { draft_config, draft_end_date, ...rest } = values;

    const data = {
      ...rest,
      draft_config: JSON.stringify(draft_config),
      draft_end_date: draft_end_date
        ? moment(draft_end_date).format("YYYY-MM-DD HH:mm:ss")
        : "",
      draft_module_ids: cards.map((item) => item.id).join(","),
    };

    activityApi.update(data).then((res) => {
      if (res.code === 200) {
        message.success("????????????");
        action === "save"
          ? router.replace(`/activity/list`)
          : setPreviewUrl(`/activity/preview/${activity_id}`);
        if (previewUrl) {
          frameRef.current.src = previewUrl;
        }
      } else {
        message.error("??????Url????????????????????????");
      }
    });
  };

  const onFinishFailed = () => {
    message.error("?????????????????????");
  };

  const handleAddModule = async (item) => {
    const { type, unique } = item;
    const addedModules = cards.map((item) => item.type).join(",");
    if (unique && addedModules.indexOf(type) > -1) {
      message.error(`????????????${type}??????????????????`);
      return;
    }

    activityApi
      .addModule({
        type: type,
        name: type,
        activity_id: activity_id,
      })
      .then((res) => {
        if (res.code === 200) {
          const model = res.data;
          setCards([...cards, model]);
          message.success("??????????????????");
        }
      });
  };

  const handleDeleteModule = (id) => {
    activityApi.deleteModule({ activity_id: activity_id, id: id });
    const newCards = [].concat(cards).filter((item) => item.id != id);
    setCards(newCards);
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

  const handleColorChange = (color, key) => {
    const formValues = form.getFieldsValue();

    const field = {};
    field[key] = color.color;

    const draft_config = Object.assign({}, formValues.draft_config, field);
    const data = Object.assign({}, formValues, { draft_config: draft_config });
    form.setFieldsValue(data);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value.toLowerCase();
    form.setFieldsValue({ url });
  };

  const handleRefresh = () => {
    if (previewUrl) {
      frameRef.current.src = previewUrl;
    }
  };

  const validateUrl = (rule, value) => {
    if (value) {
      value = value.toLowerCase();
      if (value.startsWith("copy")) {
        return Promise.reject(new Error("???????????????Url????????????copy??????"));
      }

      if (!/^[0-9a-zA-Z]{1,20}$/g.test(value)) {
        return Promise.reject(new Error("??????????????????????????????????????????20"));
      }
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("???????????????Url"));
    }
  };

  return (
    <>
      <div className="page-admin page-activity-edit">
        <Header title="????????????"></Header>
        <div className="activity-form">
          <header className="header">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/activity/list">????????????</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>????????????</Breadcrumb.Item>
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
              label="????????????"
              name="draft_name"
              rules={[{ required: true, message: "?????????????????????" }]}
            >
              <Input maxLength={20} placeholder="?????????20??????????????????" />
            </Form.Item>

            <fieldset className="form-fieldset">
              <legend>
                <BasicIcon style={{ color: "#FF0033" }} />
                ??????????????????
              </legend>
              <Form.Item
                label="????????????"
                name="draft_title"
                rules={[{ required: true, message: "?????????????????????" }]}
              >
                <Input maxLength={20} placeholder="?????????20????????????" />
              </Form.Item>

              <Form.Item
                label="??????Url"
                name="url"
                rules={[
                  {
                    validator: validateUrl,
                  },
                ]}
              >
                <Input
                  placeholder="20??????????????????????????????????????????20"
                  maxLength={20}
                  disabled={form.getFieldValue("first_publish_date") != ""}
                  onChange={handleUrlChange}
                />
              </Form.Item>

              <Form.Item
                label="???????????????"
                name="draft_keywords"
                rules={[{ required: true, message: "????????????????????????" }]}
              >
                <Input.TextArea
                  maxLength={50}
                  placeholder="?????????50?????????????????????????????????????????????"
                />
              </Form.Item>

              <Form.Item
                label="??????????????????"
                name="draft_description"
                rules={[{ required: true, message: "???????????????????????????" }]}
              >
                <Input.TextArea
                  maxLength={200}
                  placeholder="?????????200??????????????????"
                />
              </Form.Item>
            </fieldset>

            <fieldset className="form-fieldset">
              <legend>
                <ModuleIcon style={{ color: "#0066CC" }} />
                ????????????
              </legend>

              <Form.Item label="???????????????">
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
                <label>?????????????????????????????????????????????</label>
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
                ????????????
              </legend>

              <Form.Item label="???????????????">
                <div className="row">
                  <Form.Item name={["draft_config", "bgColor"]}>
                    <Input />
                  </Form.Item>
                  <ColorPicker
                    animation="slide-up"
                    color={form.getFieldValue(["draft_config", "bgColor"])}
                    onChange={(color) => handleColorChange(color, "bgColor")}
                  />
                </div>
              </Form.Item>

              <Form.Item label="???????????????">
                <div className="row">
                  <Form.Item name={["draft_config", "themeColor"]}>
                    <Input />
                  </Form.Item>
                  <ColorPicker
                    animation="slide-up"
                    color={form.getFieldValue(["draft_config", "themeColor"])}
                    onChange={(color) => handleColorChange(color, "themeColor")}
                  />
                </div>
              </Form.Item>

              <Form.Item label="????????????????????????">
                <div className="row">
                  <Form.Item name={["draft_config", "titleColor"]}>
                    <Input />
                  </Form.Item>
                  <ColorPicker
                    animation="slide-up"
                    color={form.getFieldValue(["draft_config", "titleColor"])}
                    onChange={(color) => handleColorChange(color, "titleColor")}
                  />
                </div>
              </Form.Item>
            </fieldset>

            <fieldset className="form-fieldset">
              <legend>
                <TimeIcon style={{ color: "#FF0033" }} />
                ??????????????????
              </legend>
              <Form.Item label="??????????????????" name="draft_end_date">
                <DatePicker
                  showTime
                  format={"YYYY-MM-DD HH:mm:ss"}
                  placeholder="??????????????????"
                />
              </Form.Item>
              <Form.Item label="?????????????????????????????????" name="draft_end_title">
                <Input maxLength={20} placeholder="??????20?????????" />
              </Form.Item>
              <Form.Item
                label="?????????????????????????????????"
                name="draft_end_content"
              >
                <Input.TextArea maxLength={40} placeholder="??????40?????????" />
              </Form.Item>
            </fieldset>

            <Form.Item label=" ">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={() => onFinish("save")}
              >
                ??????
              </Button>
              <br />
              <br />
              <Button
                block
                type="default"
                className="ant-btn-secondary"
                htmlType="submit"
                onClick={() => onFinish("preview")}
              >
                ???????????????
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="activity-preview">
          <div className="preview-container">
            <header className="preview-header">
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
              <p className="preview-iframe-placeholder">?????????</p>
            )}

            <div className="btn-refresh">
              <span onClick={() => handleRefresh()}>??????</span>
            </div>
          </div>
        </div>
      </div>
      {loading ? <Loading /> : null}
    </>
  );
}
