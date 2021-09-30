import { Header } from "@/components";
import Link from "next/link";

export default function List({ topics }) {
  return (
    <div className="page-topic-list">
      <Header title="Topic List"></Header>

      <main>
        <ul>
          {topics.map((item) => {
            return (
              <li key={item.id}>
                <Link href={`/topic/${item.id}`}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`https://cnodejs.org/api/v1/topics`);

  let topics = [];

  const { success, data } = await response.json();

  if (success) {
    topics = data;
  }

  return {
    props: { topics },
  };
}
