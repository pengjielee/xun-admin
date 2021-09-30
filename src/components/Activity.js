import Head from "next/head";
import dynamic from "next/dynamic";
import { defaultPageConfig, defaultModuleConfig } from "@/utils";
import Banner from "@/modules/banner/index";
import Images from "@/modules/images/index";
import Product from "@/modules/product/index";

import dayjs from "dayjs";

import "normalize.css";

const Index = ({ model }) => {
  const { activity, modules } = model;
  const {
    id,
    title,
    keywords,
    description,
    status,
    end_date,
    end_title,
    end_content,
  } = activity;

  if (status === 3) {
    return "活动已下线";
  }

  let isEnd = false;

  if (end_date) {
    const end_timestamp = dayjs(end_date).valueOf();
    const now_timestamp = dayjs().valueOf();

    if (now_timestamp > end_timestamp) {
      isEnd = true;
    }
  }

  const config = activity.config
    ? JSON.parse(activity.config)
    : defaultPageConfig;
  const { bgColor, titleColor, themeColor } = config;

  const moduleList = [];

  modules.forEach((item) => {
    const type = item.type.toLowerCase();
    let moduleData;
    try {
      moduleData = item.config
        ? JSON.parse(item.config)
        : defaultModuleConfig[type];
    } catch (e) {
      console.error(e);
    }

    const Component = dynamic(() => import(`../modules/${type}/index`));

    const moduleItem = {
      Component: Component,
      moduleData: moduleData,
      activityId: id,
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
                  activityId={Item.activityId}
                />
              ) : Item.type === "images" ? (
                <Images
                  key={index}
                  data={Item.moduleData}
                  activityId={Item.activityId}
                />
              ) : Item.type === "product" ? (
                <Product
                  key={index}
                  data={Item.moduleData}
                  activityId={Item.activityId}
                />
              ) : (
                <Item.Component
                  key={index}
                  data={Item.moduleData}
                  activityId={Item.activityId}
                />
              );
            })}
          </div>
        </main>
      </div>
      {isEnd ? (
        <>
          <div className="overlay"></div>
          <div className="page-activity-end">
            <h2 className="end-title">{end_title} </h2>
            <p className="end-title">{end_content} </p>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Index;
