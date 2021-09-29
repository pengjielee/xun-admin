import { Spin } from "antd";

const Submiting = (props) => {
  const text = props.text || "保存中...";
  return (
    <>
      <div
        className="overlay"
        style={{ background: "rgba(0, 0, 0, 0.5)" }}
      ></div>
      <div className="page-submiting">
        <Spin size="large" />
        {text}
      </div>
    </>
  );
};

export default Submiting;
