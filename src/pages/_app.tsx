import type { AppProps } from "next/app";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Menu, Breadcrumb, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FileImageOutlined,
  SettingOutlined,
  LoginOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import "antd/dist/antd.css";
import "../assets/styles/globals.css";
import "../assets/styles/user.scss";
import "../assets/styles/app.scss";
import "../assets/styles/topic.scss";
import "../assets/styles/tool-mail.scss";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const layout = Component.layout || "admin";

  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  if (layout != "admin") {
    return <Component {...pageProps} />;
  }

  const handleLogOut = () => {
    router.replace("/user/login");
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link href="/">首页</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<SettingOutlined />} title="设置">
              <Menu.Item key="6">
                <Link href="/about">关于</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-main">
          <Header className="site-main-header">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "toggle",
                onClick: toggle,
              }
            )}

            <div className="logout" onClick={handleLogOut}>
              <LoginOutlined />
              <span className="text">登出</span>
            </div>
          </Header>
          <Content className="site-main-content">
            <Component {...pageProps} />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
export default MyApp;
