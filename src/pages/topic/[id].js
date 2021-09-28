import { Header } from "@/components";
import Error from "next/error";
import Image from "next/image";

export default function Detail({ topic }) {
  if (!topic) {
    return <Error statusCode={500} title="出错了" />;
  }

  const { title, content, author } = topic;

  const { loginname, avatar_url } = author;

  return (
    <div className="page-topic-detail">
      <Header title={title}></Header>

      <main>
        <h1>${title}</h1>
        <section>
          <p> {loginname} </p>
          <Image
            src={avatar_url}
            alt={loginname}
            width="100px"
            height="100px"
          />
        </section>

        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const response = await fetch(`https://cnodejs.org/api/v1/topic/${id}`);

  let topic = null;

  const { success, data } = await response.json();

  if (success) {
    topic = data;
  }

  return {
    props: { topic },
  };
}
