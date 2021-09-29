import { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Error from "next/error";
import {
  defaultPageConfig,
  defaultModuleConfig,
  getPreviewHost,
  getBaseUrl,
} from "@/utils";

// 需要在服务端渲染的组件（为了SEO）
import Banner from "@/modules/banner/index";
import Images from "@/modules/images/index";
import Products from "@/modules/product/index";

// import 'normalize.css';

export default function Index({ model }) {
  const { activity, modules } = model;
  const { id, title, keywords, description, url } = activity;

  const config = activity.config
    ? JSON.parse(activity.config)
    : defaultPageConfig;
  const { bgColor, titleColor, themeColor } = config;

  const moduleList = [];

  modules.forEach((item) => {
    const type = item.type.toLowerCase();
    let config;
    try {
      config = item.config
        ? JSON.parse(item.config)
        : defaultModuleConfig[type];
    } catch (e) {
      console.error(e);
    }

    const Component = dynamic(() => import(`../../modules/${type}/index`));

    const moduleItem = {
      Component: Component,
      moduleData: config,
      brickId: id,
      type: type,
    };

    moduleList.push(moduleItem);
  });

  return (
    <>
      <div className="page-activity">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          />
          <title>{title}</title>
          <meta name="keywords" content={keywords} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:img" content="" />
          <meta property="og:url" content="" />
          <meta property="og:detail" content={description} />
        </Head>
        <style global jsx>
          {`
            body {
              background: ${bgColor};
            }
            .module-title {
              color: ${titleColor};
            }
            .module-title svg {
              fill: ${titleColor};
            }
            .page-activity .theme-btn {
              background: ${themeColor};
            }
          `}
        </style>
        <main className="page-body">
          <div className="module-list">
            {moduleList.map((Item, index) => {
              return Item.type === "banner" ? (
                <Banner
                  key={index}
                  data={Item.moduleData}
                  brickId={Item.brickId}
                />
              ) : Item.type === "images" ? (
                <Images
                  key={index}
                  data={Item.moduleData}
                  brickId={Item.brickId}
                />
              ) : Item.type === "product" ? (
                <Product
                  key={index}
                  data={Item.moduleData}
                  brickId={Item.brickId}
                />
              ) : (
                <Item.Component
                  key={index}
                  data={Item.moduleData}
                  brickId={Item.brickId}
                />
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(req) {
  const { id } = req.params;
  const response = await fetch(`http://localhost:3001/api/activity/${id}`);

  let model = null;
  const { code, data } = await response.json();
  if (code === 200) {
    model = data;
  }

  return {
    props: { model },
  };
}
