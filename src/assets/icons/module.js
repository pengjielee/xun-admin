import Icon from "@ant-design/icons";

const svg = () => {
  return (
    <svg
      t="1624332994821"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2979"
      width="20"
      height="20"
      fill="currentColor"
    >
      <path
        d="M170.666667 469.333333l213.333333 0 0-256-213.333333 0 0 256zM170.666667 768l213.333333 0 0-256-213.333333 0 0 256zM426.666667 768l213.333333 0 0-256-213.333333 0 0 256zM682.666667 768l213.333333 0 0-256-213.333333 0 0 256zM426.666667 469.333333l213.333333 0 0-256-213.333333 0 0 256zM682.666667 213.333333l0 256 213.333333 0 0-256-213.333333 0z"
        p-id="2980"
      ></path>
    </svg>
  );
};

const ModuleIcon = (props) => <Icon component={svg} {...props} />;

export default ModuleIcon;
