import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Divider, Button, Table, Modal, message, Menu } from "antd";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";
import { menuApi } from "@/services/index";
import { Header } from "@/components";
import { buildTree } from "@/utils/tree";

const { SubMenu } = Menu;

const TreeItem = (item) => {
  return <li key={item.id}>{item.name}</li>;
};

const Tree = ({ list }) => {
  return (
    <ul>
      {list.map((item) => {
        return <TreeItem key={item.id} {...item} />;
      })}
    </ul>
  );
};

export default function Index() {
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    menuApi.list().then((res) => {
      if (res.code === 200) {
        const list = res.data || [];
        const menus = buildTree(list, "0");
        console.log(menus);
        setMenus(menus);
      }
    });
  }, [reload]);

  const handleRemove = (id) => {
    Modal.confirm({
      title: "删除图片",
      content: "确认删除",
      onOk() {
        menuApi.remove(id).then((res) => {
          if (res.code === 200) {
            setReload(!reload);
          }
        });
      },
    });
  };

  const createMenu = (menus) => {
    return menus.map((menu) => {
      if (menu.children.length > 0) {
        return (
          <SubMenu key={menu.id} title={menu.name}>
            {createMenu(menu.children)}
          </SubMenu>
        );
      } else {
        return <Menu.Item key={menu.id}>{menu.name}</Menu.Item>;
      }
    });
  };

  return (
    <div className="page-menu-list">
      <Header title=""></Header>

      <Button
        type="primary"
        onClick={() =>
          router.push({
            pathname: "/system/menu/add/[pid]",
            query: { pid: "0" },
          })
        }
      >
        添加菜单
      </Button>
      <br />
      <br />
      <main>
        <Menu theme="light" mode="inline">
          {createMenu(menus)}
        </Menu>
      </main>
    </div>
  );
}
