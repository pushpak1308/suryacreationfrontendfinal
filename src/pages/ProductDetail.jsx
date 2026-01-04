import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import "../styles/productDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

    const [product, setProduct] = useState(null);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [uploadMessage, setUploadMessage] = useState("");

  const [selected, setSelected] = useState({
    variantValue: "",
    shape: "",
    size: "",
    availableQty: 0,
  });

  const [cartQty, setCartQty] = useState(1);
  const [price, setPrice] = useState(0);

  /* ===== OPTIONAL MULTI IMAGE UPLOAD ===== */
  const [customImages, setCustomImages] = useState([]);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        const v = data.variants[0];

        setSelected({
          variantValue: v.variantValue,
          shape: v.shape,
          size: v.size,
          availableQty: v.quantity,
        });

        setPrice(v.price);
        setCartQty(1);
      });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  /* ================= VARIANT LOGIC ================= */
  const variantsByMaterial = product.variants.filter(
    (v) => v.variantValue === selected.variantValue
  );

  const availableShapes = [...new Set(variantsByMaterial.map((v) => v.shape))];

  const availableSizes = [
    ...new Set(
      variantsByMaterial
        .filter((v) => v.shape === selected.shape)
        .map((v) => v.size)
    ),
  ];

  const selectOption = (field, value) => {
    let updated = { ...selected, [field]: value };

    if (field === "variantValue") {
      const first = product.variants.find((v) => v.variantValue === value);
      updated = {
        variantValue: first.variantValue,
        shape: first.shape,
        size: first.size,
        availableQty: first.quantity,
      };
    }

    if (field === "shape") {
      const first = variantsByMaterial.find((v) => v.shape === value);
      updated = {
        ...updated,
        size: first.size,
        availableQty: first.quantity,
      };
    }

    if (field === "size") {
      const first = variantsByMaterial.find(
        (v) => v.shape === updated.shape && v.size === value
      );
      updated = {
        ...updated,
        availableQty: first.quantity,
      };
    }

    const match = product.variants.find(
      (v) =>
        v.variantValue === updated.variantValue &&
        v.shape === updated.shape &&
        v.size === updated.size
    );

    if (match) {
      setSelected({
        variantValue: match.variantValue,
        shape: match.shape,
        size: match.size,
        availableQty: match.quantity,
      });
      setPrice(match.price);
      setCartQty(1);
    }
  };

  /* ================= IMAGE UPLOAD (OPTIONAL) ================= */

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    


  const CLOUD_NAME = "ddvdtpss6";
  const UPLOAD_PRESET = "surya-creations";

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadMessage("");
    setUploadProgress(0);

    const uploadedUrls = [];
    let rejected = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FILE_SIZE) {
        rejected = true;
        continue;
      }

      setUploadProgress(Math.round(((i + 1) / files.length) * 90));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "surya-creations");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    }

    if (rejected) {
      setUploadMessage("Some images were skipped (max 2MB allowed).");
    }

    if (uploadedUrls.length === 0) {
      setUploadProgress(0);
      return;
    }

    const updated = [...customImages, ...uploadedUrls];
    setCustomImages(updated);

    sessionStorage.setItem("CUSTOM_IMAGES", JSON.stringify(updated));

    setUploadProgress(100);
    setTimeout(() => setUploadProgress(0), 600);
  };



  const removeImage = (index) => {
    const updated = customImages.filter((_, i) => i !== index);
    setCustomImages(updated);
    sessionStorage.setItem("CUSTOM_IMAGES", JSON.stringify(updated));
  };

  /* ================= CART ================= */
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      image: product.imageUrl,
      variant: {
        material: selected.variantValue,
        shape: selected.shape,
        size: selected.size,
        availableQty: selected.availableQty,
      },
      price,
      cartQty,
      customImages, // 👈 ARRAY
    });

    window.dispatchEvent(new Event("storage"));
    alert("Added to cart");
  };

  const handleBuyNow = () => {
    sessionStorage.setItem(
      "BUY_NOW_ITEM",
      JSON.stringify({
        productId: product.id,
        productName: product.name,
        image: product.imageUrl,
        variant: {
          material: selected.variantValue,
          shape: selected.shape,
          size: selected.size,
          availableQty: selected.availableQty,
        },
        price,
        cartQty,
        customImages, // 👈 ARRAY
      })
    );
    navigate("/checkout?mode=buynow");
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

  return (
    <>
      <Navbar />

      <div className="product-detail">
        <div className="pd-divider" />

        <div className="product-wrapper">
          {/* IMAGE */}
          <div className="product-image">
            <img src={product.imageUrl} alt={product.name} />
          </div>

          {/* INFO */}
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-desc">{product.description}</p>

            {renderOptions("Material / Finish", "variantValue", [
              ...new Set(product.variants.map((v) => v.variantValue)),
            ])}
            {renderOptions("Shape", "shape", availableShapes)}
            {renderOptions("Size", "size", availableSizes)}

            {/* OPTIONAL IMAGE UPLOAD */}
            <div className="custom-upload">
              <div className="upload-title">Upload images (optional)</div>

              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
                <span>Click to upload images</span>
              </label>

              {/* INLINE MESSAGE */}
              {uploadMessage && (
                <div className="upload-warning">{uploadMessage}</div>
              )}

              {/* PROGRESS BAR */}
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div
                    className="upload-progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {/* PREVIEW */}
              {customImages.length > 0 && (
                <div className="upload-preview-grid">
                  {customImages.map((img, i) => (
                    <div key={i} className="preview-item">
                      <img src={img} alt="preview" />
                      <button onClick={() => removeImage(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QTY */}
            <div className="qty-section">
              <div className="stock">
                Available: <b>{selected.availableQty}</b>
              </div>

              <div className="qty-selector">
                <button
                  disabled={cartQty <= 1}
                  onClick={() => setCartQty((q) => q - 1)}
                >
                  −
                </button>
                <span>{cartQty}</span>
                <button
                  disabled={cartQty >= selected.availableQty}
                  onClick={() => setCartQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* PRICE */}
            <div className="price-box">₹{price}</div>

            {/* CTA */}
            <div className="cta-group">
              <button className="add-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
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
