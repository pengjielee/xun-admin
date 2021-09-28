import dynamic from "next/dynamic";

const ReactWEditor = dynamic(import("wangeditor-for-react"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

// const config = {
//   height: 500,
//   menus: ['bold', 'link', 'image'],
//   showFullScreen: true
// };

const Editor = (props) => {
  const { content, onChange, height = 500 } = props;

  const config = {
    height: height,
  };

  console.log(config);

  return (
    <ReactWEditor
      config={config}
      defaultValue={content}
      onChange={onChange}
    ></ReactWEditor>
  );
};

export default Editor;
