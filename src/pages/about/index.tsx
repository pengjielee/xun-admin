import { Header, Intro } from "@/components";

export default function About() {
  return (
    <div className="page-about">
      <Header title="关于"></Header>

      <main>
        <h1>About Page</h1>
        <Intro name="peng" age={20} />
      </main>
    </div>
  );
}
