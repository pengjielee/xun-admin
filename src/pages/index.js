import Head from "next/head";
import Link from "next/link";
import { Row, Col } from "antd";
import {
  SendOutlined,
  SwapOutlined,
  BarsOutlined,
  NumberOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const renderIcon = (type) => {
  switch (type) {
    case "send":
      return <SendOutlined style={{ fontSize: "32px" }} />;
    case "task":
      return <DatabaseOutlined style={{ fontSize: "32px" }} />;
    case "exchange":
      return <SwapOutlined style={{ fontSize: "32px" }} />;
    case "changelog":
      return <BarsOutlined style={{ fontSize: "32px" }} />;
    case "manage":
      return <NumberOutlined style={{ fontSize: "32px" }} />;
    default:
      return <SendOutlined style={{ fontSize: "32px" }} />;
  }
};

const Home = () => {
  const cards = [
    { id: 1, name: "关于", href: "/about", type: "task" },
    { id: 2, name: "计数器", href: "/counter", type: "send" },
    { id: 3, name: "CNode", href: "/topic", type: "exchange" },
    { id: 4, name: "生成邮箱签名", href: "/tool/mail", type: "manage" },
    { id: 5, name: "编辑器", href: "/tool/wangeditor", type: "changelog" },
  ];

  return (
    <div className="page-home">
      <Head>
        <title>My Next Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Row gutter={[20, 20]}>
          {cards.map((card) => {
            return (
              <Col span={6} key={card.id}>
                <Link href={card.href} passHref>
                  <div className="card">
                    {renderIcon(card.type)}
                    <span className="text">{card.name}</span>
                  </div>
                </Link>
              </Col>
            );
          })}
        </Row>
      </main>
    </div>
  );
};

export default Home;