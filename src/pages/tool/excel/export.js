import { Header } from "@/components";
import { Button } from "antd";
import { fileApi } from "@/services/index";

const App = () => {
  return (
    <div className="pages-tool-excel-export">
      <Header title="Excel Export"></Header>

      <Button type="primary" onClick={() => fileApi.exportNote()}>
        导出笔记
      </Button>
    </div>
  );
};

export default App;
