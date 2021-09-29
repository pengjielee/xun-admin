export default function Banner(props) {
  const { image, href, alt, effect } = props.data;

  const handleClick = () => {
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
    <div className="module-banner">
      <img
        className="banner-object"
        alt={alt}
        src={image}
        onClick={handleClick}
      />
    </div>
  );
}
