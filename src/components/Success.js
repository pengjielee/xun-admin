export default function Success(props) {
  const {
    successTitle,
    successContent,
    successQrImg,
    successBtnHref,
    successBtnText,
  } = props.data;

  return (
    <div className="page-success">
      <img
        className="success-icon"
        src="https://of.xmfile.cn/pro/mkt_resource/20210608/9d3ec9a2d9464b1c880b4cd2854c213d.png"
      />
      <h2 className="success-title">{successTitle || "资料提交成功"}</h2>
      <div className="success-content">{successContent || "提交成功"}</div>
      {successQrImg ? (
        <img src={successQrImg} className="success-qrimg" />
      ) : null}
      <a className="success-link" href={successBtnHref}>
        {successBtnText || "返回首页"}
      </a>
    </div>
  );
}
