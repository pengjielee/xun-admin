import { Header } from "@/components";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactWEditor = dynamic(import("wangeditor-for-react"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

// const config = {
//   height: 500,
//   menus: ['bold', 'link', 'image'],
//   showFullScreen: true
// };

const App = () => {
  const [content, setContent] = useState("");

  const handleEditorChange = (content) => {
    setContent(content);
  };

  return (
    <div className="page-tool-editor">
      <Header title="WangEditor"></Header>
      <h1 className="title">WangEditor</h1>

      <ReactWEditor
        defaultValue={content}
        onChange={handleEditorChange}
      ></ReactWEditor>
    </div>
  );
};

export default App;
