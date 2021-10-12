import { Header } from "@/components";
import { Button } from "antd";

const App = () => {
  return (
    <div className="page-tool-iphone">
      <Header title="Iphone"></Header>

      <div className="marvel-device iphone8plus silver">
        <div className="top-bar"></div>
        <div className="sleep"></div>
        <div className="volume"></div>
        <div className="camera"></div>
        <div className="sensor"></div>
        <div className="speaker"></div>
        <div className="screen">
          <iframe src="http://m.baidu.com/"></iframe>
        </div>
        <div className="home"></div>
        <div className="bottom-bar"></div>
      </div>
    </div>
  );
};

export default App;
