import { Header } from "@/components";
import { useState } from "react";
import { Input } from "antd";
import { remark } from "remark";
import remarkHtml from "remark-html";

const { TextArea } = Input;

const App = () => {
  const [html, setHtml] = useState("");

  const handleChange = (e) => {
    const content = e.target.value;
    remark()
      .use(remarkHtml)
      .process(content)
      .then((result) => {
        setHtml(result.toString());
      });
  };

  return (
    <div className="page-tool-markdown">
      <Header title="Markdown"></Header>
      <div className="container">
        <p>Markdown</p>
        <TextArea
          rows={10}
          onChange={handleChange}
          placeholder="请输入Markdown内容"
        />
        <br />
        <br />
        <p>Html</p>
        <TextArea rows={10} value={html} />
        <br />
        <br />
        <p>预览区</p>
        <div
          className="preview"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
    </div>
  );
};

export default App;
