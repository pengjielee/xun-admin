import Head from "next/head";
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
    <div className="pages-tool-mail">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,user-scalable=no"
        />
        <title>WangEditor</title>
      </Head>
      <h1 className="title">WangEditor</h1>

      <ReactWEditor
        defaultValue={content}
        onChange={handleEditorChange}
      ></ReactWEditor>
    </div>
  );
};

export default App;
