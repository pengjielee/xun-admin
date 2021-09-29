import fetch from "./fetch";
export { fetch };

const isProd = process.env.NODE_ENV === "production";

export const defaultPageConfig = {
  bgColor: "#797979",
  themeColor: "#797979",
  titleColor: "#797979",
};

export const defaultModuleConfig = {
  title: { title: "" },
  forms: {
    inputs: [],
    successTitle: "",
    successContent: "",
    successBtnText: "返回活动首页",
    successBtnHref: "",
    successQrImg: "",
    submitBtnText: "提交",
  },
  products: { products: [], align: "1" },
  images: { images: [], align: "1" },
  banner: {
    bannerImg: "",
    bannerHref: "",
    bannerAlt: "",
    bannerEffect: "nothing",
  },
  rules: { ruleTitle: "", ruleContent: "" },
  richtext: {
    content: "",
    isRecommend: false,
    recommendTitle: "",
    recommendDes: "",
    recommendImg: "",
    recommendLink: "",
    recommendBtnText: "查看",
  },
};

export const effectOptions = [
  { id: 1, text: "无功能", value: "nothing" },
  { id: 2, text: "锚定到表单区", value: "form" },
  { id: 3, text: "打开链接", value: "link" },
];

export const activityStatusOptions = [
  { id: 1, text: "已上线", value: 0 },
  { id: 2, text: "待发布", value: 1 },
  { id: 3, text: "已下线", value: 2 },
];

export const getPreviewHost = () => {
  return process.env.NEXT_PUBLIC_TARGET === "test"
    ? "http://localhost:7001/"
    : "http://localhost:7001/";
};

export const getBaseUrl = (source = "") => {
  let baseURL = "";
  switch (process.env.NEXT_PUBLIC_TARGET) {
    case "test":
      baseURL = "";
      break;
    case "prod":
      baseURL = "";
      break;
    case "dev":
      baseURL = source === "server" ? "http://localhost:7001/" : "/";
      break;
    default:
      baseURL = "";
      break;
  }
  return baseURL;
};

export { isProd };
