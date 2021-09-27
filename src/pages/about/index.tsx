import Head from "next/head";

import Intro from "../../components/Intro";

export default function About() {
  return (
    <div className="page page-about">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,user-scalable=no"
        />
        <title>关于</title>
      </Head>

      <main>
        <h1>About Page</h1>

        <Intro name="peng" age={20} />
      </main>
    </div>
  );
}
