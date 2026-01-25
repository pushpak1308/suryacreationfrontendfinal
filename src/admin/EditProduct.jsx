import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../services/ProductService";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  // ✅ Input temp states
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");

  /* ===============================
     LOAD PRODUCT
     =============================== */
  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct({
        ...data,
        occasion: data.occasion || "",

        // ✅ MOQ (NULL SAFE)
        enforceMinQuantity: data.enforceMinQuantity || false,
        minOrderQuantity: data.minOrderQuantity || "",

        // ✅ MULTI MEDIA NULL SAFE
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
      });
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  /* ===============================
     MEDIA HELPERS
     =============================== */
  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const url = newImageUrl.trim();

    if (product.images.includes(url)) {
      alert("Image already added");
      return;
    }

    setProduct((prev) => ({ ...prev, images: [...prev.images, url] }));
    setNewImageUrl("");
  };

  const removeImageUrl = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addVideoUrl = () => {
    if (!newVideoUrl.trim()) return;
    const url = newVideoUrl.trim();

    if (product.videos.includes(url)) {
      alert("Video already added");
      return;
    }

    setProduct((prev) => ({ ...prev, videos: [...prev.videos, url] }));
    setNewVideoUrl("");
  };

  const removeVideoUrl = (index) => {
    setProduct((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  /* ===============================
     VARIANT HELPERS
     =============================== */
  const updateVariant = (index, field, value) => {
    const updated = [...product.variants];
    updated[index][field] = value;
    setProduct({ ...product, variants: updated });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        {
          variantType: "",
          variantValue: "",
          shape: "",
          size: "",
          quantity: 1,
          price: "",
        },
      ],
    });
  };

  const removeVariant = (index) => {
    const updated = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: updated });
  };

  /* ===============================
     SAVE
     =============================== */
  const handleSave = async () => {
    const payload = {
      ...product, // ✅ KEEP EVERYTHING

      // Normalize optional fields
      occasion: product.occasion || null,

      // MOQ normalization
      enforceMinQuantity: product.enforceMinQuantity,
      minOrderQuantity: product.enforceMinQuantity
        ? Number(product.minOrderQuantity)
        : null,

      // ✅ Multi URLs
      images: product.images || [],
      videos: product.videos || [],

      // Normalize variants
      variants: product.variants.map((v) => ({
        ...v,
        quantity: Number(v.quantity),
        price: Number(v.price),
      })),
    };

    await updateProduct(id, payload);
    alert("Product updated successfully");
    navigate("/admin/products");
  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-container">
        <h2>Edit Product</h2>

        {/* ================= BASIC INFO ================= */}
        <input
          placeholder="Product name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <input
          placeholder="Category (slug format)"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

        <input
          placeholder="Main Image URL"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
        />

        {/* ================= MULTIPLE IMAGES ================= */}
        <h3>Additional Images</h3>

        <div className="media-row">
          <input
            placeholder="Paste Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <button type="button" className="media-add-btn" onClick={addImageUrl}>
            + Add
          </button>
        </div>

        {product.images.length > 0 && (
          <div className="media-preview-grid">
            {product.images.map((url, idx) => (
              <div key={idx} className="media-preview-card">
                <img
                  src={url}
                  alt="preview"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <button
                  type="button"
                  className="media-preview-remove"
                  onClick={() => removeImageUrl(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= VIDEOS ================= */}
        <h3>Videos</h3>

        <div className="media-row">
          <input
            placeholder="Paste Video URL (.mp4 or YouTube)"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
          />
          <button type="button" className="media-add-btn" onClick={addVideoUrl}>
            + Add
          </button>
        </div>

        {product.videos.length > 0 && (
          <div className="video-preview-grid">
            {product.videos.map((url, idx) => (
              <div key={idx} className="video-preview-card">
                <div className="video-label">🎬 Video</div>
                <div className="video-url">{url}</div>

                <button
                  type="button"
                  className="media-preview-remove"
                  onClick={() => removeVideoUrl(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= OCCASION ================= */}
        <div className="form-group">
          <label>Occasion</label>
          <select
            value={product.occasion}
            onChange={(e) =>
              setProduct({ ...product, occasion: e.target.value })
            }
          >
            <option value="">None</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="corporate">Corporate</option>
            <option value="decor">Home Décor</option>
            <option value="stationery">Stationery</option>
          </select>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <textarea
          placeholder="Product description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        {/* ================= MOQ SECTION ================= */}
        <div className="form-group">
          <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={product.enforceMinQuantity}
              onChange={(e) =>
                setProduct({
                  ...product,
                  enforceMinQuantity: e.target.checked,
                  minOrderQuantity: e.target.checked
                    ? product.minOrderQuantity
                    : "",
                })
              }
            />
            Enforce Minimum Order Quantity
          </label>
        </div>

        {product.enforceMinQuantity && (
          <input
            type="number"
            min="1"
            placeholder="Minimum Quantity Required"
            value={product.minOrderQuantity}
            onChange={(e) =>
              setProduct({
                ...product,
                minOrderQuantity: e.target.value,
              })
            }
            required
          />
        )}

        {/* ================= VARIANTS ================= */}
        <h3>Variants</h3>

        {product.variants.map((v, index) => (
          <div key={index} className="variant-box">
            <input
              placeholder="Variant type"
              value={v.variantType}
              onChange={(e) =>
                updateVariant(index, "variantType", e.target.value)
              }
            />
            <input
              placeholder="Variant value"
              value={v.variantValue}
              onChange={(e) =>
                updateVariant(index, "variantValue", e.target.value)
              }
            />
            <input
              placeholder="Shape"
              value={v.shape}
              onChange={(e) => updateVariant(index, "shape", e.target.value)}
            />
            <input
              placeholder="Size"
              value={v.size}
              onChange={(e) => updateVariant(index, "size", e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              value={v.quantity}
              onChange={(e) => updateVariant(index, "quantity", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) => updateVariant(index, "price", e.target.value)}
            />

            <button type="button" onClick={() => removeVariant(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addVariant}>
          + Add Variant
        </button>

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </>
  );
};

export default EditProduct;
