export default function Rules(props) {
  const { title, content } = props.data;

  return (
    <>
      <div className="module-rules">
        <p className="rule-title">{title}</p>
        <div
          className="rule-content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </>
  );
}
