import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import "../styles/productDetail.css";

/* ✅ Cloudinary config */
const CLOUD_NAME = "ddvdtpss6";
const UPLOAD_PRESET = "surya-creations";
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [selected, setSelected] = useState({
    variantValue: "",
    shape: "",
    size: "",
  });

  const [cartQty, setCartQty] = useState(1);
  const [price, setPrice] = useState(0);

  /* ✅ Gallery */
  const [activeMedia, setActiveMedia] = useState({
    type: "image",
    url: "",
  });

  /* ✅ upload state */
  const [customImages, setCustomImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    fetch(`https://surya-creations.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        const v = data.variants?.[0];

        if (v) {
          setSelected({
            variantValue: v.variantValue,
            shape: v.shape,
            size: v.size,
          });
          setPrice(v.price);
        }

        const initialQty =
          data.enforceMinQuantity && data.minOrderQuantity
            ? data.minOrderQuantity
            : 1;

        setCartQty(initialQty);

        const images = data.images?.length
          ? data.images
          : data.imageUrl
          ? [data.imageUrl]
          : [];

        const firstImg = images[0] || "";
        setActiveMedia({ type: "image", url: firstImg });
      })
      .catch((err) => console.error(err));
  }, [id]);

  /* ================= MEDIA LIST ================= */
  const mediaList = useMemo(() => {
    if (!product) return [];

    const images = product.images?.length
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

    const videos = product.videos?.length ? product.videos : [];

    return [
      ...images.filter(Boolean).map((url) => ({ type: "image", url })),
      ...videos.filter(Boolean).map((url) => ({ type: "video", url })),
    ];
  }, [product]);

  if (!product) return <p>Loading...</p>;

  /* ================= VARIANTS ================= */
  const variantsGroupedByType = product.variants.reduce((acc, v) => {
    if (!acc[v.variantType]) acc[v.variantType] = [];
    acc[v.variantType].push(v);
    return acc;
  }, {});

  const variantsByValue = product.variants.filter(
    (v) => v.variantValue === selected.variantValue
  );

  const availableShapes = [...new Set(variantsByValue.map((v) => v.shape))];
  const availableSizes = [
    ...new Set(
      variantsByValue
        .filter((v) => v.shape === selected.shape)
        .map((v) => v.size)
    ),
  ];

  const selectVariantValue = (value) => {
    const first = product.variants.find((v) => v.variantValue === value);
    if (!first) return;

    setSelected({
      variantValue: first.variantValue,
      shape: first.shape,
      size: first.size,
    });

    setPrice(first.price);
    setCartQty(
      product.enforceMinQuantity && product.minOrderQuantity
        ? product.minOrderQuantity
        : 1
    );
  };

  const selectOption = (field, value) => {
    let updated = { ...selected, [field]: value };

    if (field === "shape") {
      const first = variantsByValue.find((v) => v.shape === value);
      if (first) updated = { ...updated, size: first.size };
    }

    const match = product.variants.find(
      (v) =>
        v.variantValue === updated.variantValue &&
        v.shape === updated.shape &&
        v.size === updated.size
    );

    if (match) {
      setSelected(updated);
      setPrice(match.price);
    }
  };

  const renderOptions = (title, field, values) => (
    <div className="option-group">
      <div className="option-title">{title}</div>
      <div className="option-grid">
        {values.map((val) => (
          <div
            key={val}
            className={`option-card ${selected[field] === val ? "active" : ""}`}
            onClick={() => selectOption(field, val)}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) continue;

        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: fd }
        );

        const data = await res.json();
        if (data.secure_url) {
          setCustomImages((prev) => [...prev, data.secure_url]);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setUploading(false);
  };

  const removeCustomImage = (i) =>
    setCustomImages((imgs) => imgs.filter((_, idx) => idx !== i));

  /* ================= MOQ ================= */
  const minQty = product.enforceMinQuantity ? product.minOrderQuantity : 1;
  const canProceed = cartQty >= minQty;

  /* ================= CART ================= */
  const buildItem = () => ({
    productId: product.id,
    productName: product.name,
    image: product.imageUrl,
    variant: {
      value: selected.variantValue,
      shape: selected.shape,
      size: selected.size,
    },
    price,
    cartQty,
    customImages,
    enforceMinQuantity: product.enforceMinQuantity,
    minOrderQuantity: product.minOrderQuantity,
  });

  const handleAddToCart = () => {
    if (!canProceed) return alert(`Minimum order quantity is ${minQty}`);
    addToCart(buildItem());
    window.dispatchEvent(new Event("storage"));
    alert("Added to cart");
  };

  const handleBuyNow = () => {
    if (!canProceed) return alert(`Minimum order quantity is ${minQty}`);
    sessionStorage.setItem("BUY_NOW_ITEM", JSON.stringify(buildItem()));
    navigate("/checkout?mode=buynow");
  };

  return (
    <>
      <Navbar />

      <div className="product-detail">
        <div className="product-wrapper">
          {/* MEDIA */}
          <div className="product-image">
            <div className="pd-main-media">
              {activeMedia.type === "video" ? (
                <video src={activeMedia.url} controls className="pd-main-img" />
              ) : (
                <img
                  src={activeMedia.url || product.imageUrl}
                  alt={product.name}
                  className="pd-main-img"
                />
              )}
            </div>

            {mediaList.length > 1 && (
              <div className="pd-thumbs">
                {mediaList.map((m, idx) => (
                  <div
                    key={idx}
                    className={`pd-thumb ${
                      activeMedia.url === m.url ? "active" : ""
                    }`}
                    onClick={() => setActiveMedia(m)}
                  >
                    {m.type === "video" ? (
                      <div className="pd-video-thumb">▶</div>
                    ) : (
                      <img src={m.url} alt="thumb" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-desc">{product.description}</p>

            {product.enforceMinQuantity && (
              <div className="min-qty-info">
                Minimum order quantity: <b>{product.minOrderQuantity}</b>
              </div>
            )}

            {Object.entries(variantsGroupedByType).map(([type, variants]) => (
              <div key={type} className="option-group">
                <div className="option-title">{type}</div>
                <div className="option-grid">
                  {[...new Set(variants.map((v) => v.variantValue))].map(
                    (value) => (
                      <div
                        key={value}
                        className={`option-card ${
                          selected.variantValue === value ? "active" : ""
                        }`}
                        onClick={() => selectVariantValue(value)}
                      >
                        {value}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {availableShapes.length > 0 &&
              renderOptions("Shape", "shape", availableShapes)}
            {availableSizes.length > 0 &&
              renderOptions("Size", "size", availableSizes)}

            {/* ✅ Upload block — classnames matched to OLD CSS */}
            <div className="custom-upload">
              <div className="upload-title">Upload Images</div>

              <label className="upload-box">
                <span>Select images</span>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {uploading && <div className="upload-warning">Uploading...</div>}

              <div className="upload-preview-grid">
                {customImages.map((u, i) => (
                  <div key={i} className="preview-item">
                    <img src={u} alt="custom" />
                    <button onClick={() => removeCustomImage(i)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* QTY */}
            <div className="qty-section">
              <div className="qty-selector">
                <button
                  disabled={cartQty <= minQty}
                  onClick={() => setCartQty((q) => Math.max(q - 1, minQty))}
                >
                  −
                </button>
                <span>{cartQty}</span>
                <button onClick={() => setCartQty((q) => q + 1)}>+</button>
              </div>
            </div>

            <div className="price-box">₹{price}</div>

            <div className="cta-group">
              <button
                className="add-cart-btn"
                disabled={!canProceed}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="buy-now-btn"
                disabled={!canProceed}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
