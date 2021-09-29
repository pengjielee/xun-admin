export default function Rules(props) {
  const {
    content,
    isRecommend,
    recommendTitle,
    recommendDes,
    recommendImg,
    recommendLink,
    recommendBtnText,
  } = props.data;

  return (
    <>
      <div className="module-richtext">
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        {isRecommend ? (
          <>
            <div className="recommend-card">
              <a className="recommend-link" href={recommendLink}>
                <div className="left">
                  <img
                    src={recommendImg}
                    alt={recommendTitle}
                    className="recommend-image"
                  />
                </div>
                <div className="middle">
                  <h2 className="recommend-title">{recommendTitle}</h2>
                  <div className="recommend-des">{recommendDes}</div>
                </div>
                <div className="right">
                  <button className="theme-btn">{recommendBtnText}</button>
                </div>
              </a>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
