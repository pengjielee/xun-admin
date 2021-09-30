import Image from "next/image";
import successImg from "@/images/success.png";

export default function Success(props) {
  const { title, content, qrImg, btnHref, btnText } = props.data;

  return (
    <div className="page-success">
      <Image className="success-icon" src={successImg} alt="" laytout="fill" />
      <h2 className="success-title">{title || "资料提交成功"}</h2>
      <div className="success-content">{content || "提交成功"}</div>
      {qrImg ? <Image alt="" src={qrImg} className="success-qrimg" /> : null}
      <a className="success-link" href={btnHref}>
        {btnText || "返回首页"}
      </a>
    </div>
  );
}
