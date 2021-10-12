// import type { AppProps } from "next/app";
import App from "next/app";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Menu, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  LoginOutlined,
  HomeOutlined,
  FileTextOutlined,
  MailOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import "antd/dist/antd.css";
import "../assets/styles/globals.scss";
import "../assets/styles/user.scss";
import "../assets/styles/site.scss";
import "../assets/styles/page.scss";
import "../assets/styles/activity.scss";
import "../assets/styles/iphone.scss";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const menus = [
  {
    id: 1,
    path: "/",
    name: "首页",
    key: "1",
    icon: <HomeOutlined />,
    subs: [],
  },
  {
    id: 2,
    path: "/note/list",
    name: "随记",
    key: "2",
    icon: <MailOutlined />,
    subs: [],
  },
  {
    id: 3,
    path: "/article/list",
    name: "文章",
    key: "3",
    icon: <FileTextOutlined />,
    subs: [],
  },
  {
    id: 4,
    path: "/file/list",
    name: "文件",
    key: "4",
    icon: <UploadOutlined />,
    subs: [],
  },
  {
    id: 5,
    path: "/activity/list",
    name: "活动",
    key: 5,
    icon: <HomeOutlined />,
    subs: [],
  },
  {
    id: 6,
    path: "/tool",
    name: "工具",
    key: "6",
    icon: <SettingOutlined />,
    subs: [
      {
        id: 61,
        path: "/tool/mail",
        name: "生成邮箱签名",
        key: "61",
        icon: null,
        subs: [],
      },
      {
        id: 62,
        path: "/tool/wangeditor",
        name: "编辑器",
        key: "62",
        icon: null,
        subs: [],
      },
      {
        id: 63,
        path: "/tool/excel/export",
        name: "导出Excel",
        key: "63",
        icon: null,
        subs: [],
      },
      {
        id: 64,
        path: "/tool/qrcode",
        name: "生成二维码",
        key: "64",
        icon: null,
        subs: [],
      },
      {
        id: 65,
        path: "/tool/barcode",
        name: "生成条形码",
        key: "65",
        icon: null,
        subs: [],
      },
      {
        id: 66,
        path: "/tool/echarts",
        name: "Echarts",
        key: "66",
        icon: null,
        subs: [],
      },
    ],
  },
];

function MyApp({ Component, pageProps, pathname }) {
  const router = useRouter();
  const layout = (Component && Component.layout) || "admin";

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

  let selectedKeys = ["1"];
  let openKeys = ["1"];

  if (pathname) {
    let matchedMenu = null;
    const firstpath = pathname.substring(0, pathname.lastIndexOf("/"));
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].subs.length > 0) {
        if (menus[i].path.indexOf(firstpath) >= 0) {
          matchedMenu = menus[i];
          break;
        }
      }
    }

    if (matchedMenu) {
      if (matchedMenu.subs.length <= 0) {
        const subpath = pathname.substring(0, pathname.lastIndexOf("/"));
        selectedKeys = [matchedMenu.key];
        openKeys = [matchedMenu.key];
      } else {
        const subs = matchedMenu.subs;
        for (let i = 0; i < subs.length; i++) {
          if (pathname === subs[i].path) {
            selectedKeys = [matchedMenu.key, subs[i].key];
            openKeys = [matchedMenu.key, subs[i].key];
          }
        }
      }
    }
  }

  const renderMenus = () => {
    return menus.map((menu) => {
      if (menu.subs.length > 0) {
        return (
          <SubMenu key={menu.key} icon={menu.icon} title={menu.name}>
            {menu.subs.map((submenu) => {
              return (
                <Menu.Item key={submenu.key} icon={submenu.icon}>
                  <Link href={submenu.path}>{submenu.name}</Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={menu.key} icon={menu.icon}>
            <Link href={menu.path}>{menu.name}</Link>
          </Menu.Item>
        );
      }
    });
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenus()}
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

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const pathname = appContext.router.pathname || "/";

  return { ...appProps, pathname };
};

export default MyApp;
