import Icon from "@ant-design/icons";

const svg = () => {
  return (
    <svg
      t="1624332623493"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2247"
      width="15"
      height="15"
      fill="currentColor"
    >
      <path
        d="M924.00128 64H99.99872C44.8 64 0 108.8 0 163.99872v532.16256C0 751.36 44.8 796.16 99.99872 796.16H480V896h-256c-17.69984 0-32 14.30016-32 32s14.30016 32 32 32h576c17.69984 0 32-14.30016 32-32s-14.30016-32-32-32h-256v-99.84h380.00128c55.19872 0 99.99872-44.8 99.99872-99.99872V163.99872c0-55.19872-44.8-99.99872-99.99872-99.99872z m35.99872 632.16128a35.97824 35.97824 0 0 1-35.99872 35.99872H99.99872a35.97824 35.97824 0 0 1-35.99872-35.99872V163.99872A35.97824 35.97824 0 0 1 99.99872 128h824.00256a35.97824 35.97824 0 0 1 35.99872 35.99872v532.16256z"
        p-id="2248"
      ></path>
      <path
        d="M778.74176 597.49888a38.00064 38.00064 0 1 0 76.00128 0 38.00064 38.00064 0 0 0-76.00128 0z"
        p-id="2249"
      ></path>
    </svg>
  );
};

const BasicIcon = (props) => <Icon component={svg} {...props} />;

export default BasicIcon;