import { useRef } from "react";
import { message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fileApi } from "@/services";

const Uploader = (props) => {
  //上传多个文件
  const multipie = props.multipie || false;
  const fileRef = useRef();

  const handleSingleChange = (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    const { type, size } = file || {};
    // 检查文件大小是否超过最大限制
    if (size && size > 1024 * 1024 * 60) {
      message.warning("上传文件超过60M");
      return;
    }

    let fileType = type?.split("/")[0];

    if (fileType != "image") {
      message.warning("请上传图片类型");
      return;
    }

    formData.append("file", file);
    fileApi
      .upload(formData)
      .then((res) => {
        if (typeof props.onChange === "function") {
          props.onChange(res);
        }
      })
      .finally(() => (fileRef.current.value = ""));
  };

  const handleFilesChange = (e) => {
    const formData = new FormData();
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    fileApi
      .uploads(formData)
      .then((res) => {
        if (typeof props.onChange === "function") {
          props.onChange(res);
        }
      })
      .finally(() => (fileRef.current.value = ""));
  };

  const handleClick = () => {
    fileRef.current.click();
  };

  return (
    <div className="upload-control">
      <div className="upload-button" onClick={handleClick}>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
      {multipie ? (
        <input
          type="file"
          ref={fileRef}
          onChange={handleFilesChange}
          multiple
          accept="image/*"
          style={{ display: "none" }}
        />
      ) : (
        <input
          type="file"
          ref={fileRef}
          onChange={handleSingleChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      )}
    </div>
  );
};

export default Uploader;
