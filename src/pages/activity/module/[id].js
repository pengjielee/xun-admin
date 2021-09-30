import { Breadcrumb } from "antd";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";

export default function Index({ model }) {
  let { type, config } = model;
  config = config ? JSON.parse(config) : null;

  const moduleData = {
    ...model,
    ...config,
  };

  const Module = dynamic(() => import(`../../../modules/${type}/edit`));

  return (
    <div className="page-admin">
      <Head>
        <title>编辑模块</title>
      </Head>
      <header className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href="/activity/list">活动列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>编辑模块</Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <Module moduleData={moduleData} />
    </div>
  );
}

export async function getServerSideProps(req) {
  const { id } = req.params;

  if (!id) {
    return {
      notFound: true,
    };
  }

  const response = await fetch(
    `http://localhost:3001/api/activity/module/${id}`
  );

  let model = null;
  const { code, data } = await response.json();
  if (code === 200) {
    model = data;
  }
  return {
    props: { model },
  };
}
