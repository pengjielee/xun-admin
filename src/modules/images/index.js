export default function Images(props) {
  const { data } = props;

  const images = data.images || [];
  const align = data.align || "1";

  const handleClick = (item) => {
    const { effect, href } = item;
    if (effect === "nothing") {
      return;
    }
    if (effect === "form") {
      window.location.href = "#form";
      return;
    }
    window.location.href = href;
  };

  return (
    <>
      <div className="module-images">
        <div className={`image-list column-${align}`}>
          {images.map((item, index) => {
            return (
              <div className="image-item" key={index}>
                <img
                  className="image-object"
                  alt={item.alt}
                  src={item.src}
                  onClick={() => handleClick(item)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
