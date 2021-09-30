import React from "react";
import { useRouter } from "next/router";
import { Header } from "@/components";

const Detail = ({ model }) => {
  const router = useRouter();
  const { title, content } = model;

  return (
    <div className="page-article-detail">
      <Header title={title}></Header>

      <main>
        <h2 className="title">{title}</h2>

        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>

        <a type="link" onClick={() => router.back()}>
          返回
        </a>
      </main>
    </div>
  );
};

export default Detail;

export async function getServerSideProps(req) {
  const { id } = req.params;
  const response = await fetch(`http://localhost:3001/api/article/${id}`);

  let model = null;
  const { code, data } = await response.json();
  if (code === 200) {
    model = data;
  }
  return {
    props: { model },
  };
}
