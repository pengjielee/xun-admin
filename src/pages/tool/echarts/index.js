import { Header } from "@/components";
import ReactEcharts from "echarts-for-react";

const App = () => {
  const option1 = {
    xAxis: {
      type: "category",
      data: ["A", "B", "C"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150],
        type: "line",
      },
    ],
  };

  const option2 = {
    series: [
      {
        type: "pie",
        data: [
          {
            value: 335,
            name: "直接访问",
          },
          {
            value: 234,
            name: "联盟广告",
          },
          {
            value: 1548,
            name: "搜索引擎",
          },
        ],
      },
    ],
  };
  const option3 = {
    xAxis: {
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {},
    series: [
      {
        type: "bar",
        data: [23, 24, 18, 25, 27, 28, 25],
      },
    ],
  };

  return (
    //https://echarts.apache.org/handbook/zh/how-to/chart-types/bar/basic-bar
    <div className="page-tool-echarts">
      <Header title="Echarts"></Header>

      <h3>最简单的折线图</h3>
      <ReactEcharts option={option1} />

      <h3>最简单的饼图</h3>
      <ReactEcharts option={option2} />

      <h3>最简单的柱状图</h3>
      <ReactEcharts option={option3} />
    </div>
  );
};

export default App;
