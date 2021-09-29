export default function Products(props) {
  const { data } = props;

  const products = data.products || [];
  const align = data.align || "1";

  return (
    <>
      <div className="module-products">
        <div className={`product-list column-${align}`}>
          {products.map((item, index) => {
            return (
              <div className="product-item" key={index}>
                <a href={item.href} className="product-link">
                  <div className="left">
                    <img
                      alt={item.description}
                      src={item.image}
                      className="product-image"
                    />
                  </div>
                  <div className="right">
                    <h2 className="product-title overflow-2">{item.title}</h2>
                    {item.tag ? (
                      <div className="product-tags">
                        <span className="tag">{item.tag}</span>
                      </div>
                    ) : null}
                    <div className="product-price">
                      <span className="current">￥{item.currentPrice}</span>
                      <span className="original">￥{item.originalPrice}</span>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
