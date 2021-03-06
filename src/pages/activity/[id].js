import { Activity } from "@/components";

const Index = ({ model }) => {
  return <Activity model={model} />;
};

Index.layout = "fullpage";

export default Index;

export async function getServerSideProps(req) {
  const { id } = req.params;
  const response = await fetch(`http://localhost:3001/api/activity/byid/${id}`);

  let model = null;
  const { code, data } = await response.json();
  if (code === 200) {
    model = data;
  }

  return {
    props: { model },
  };
}
