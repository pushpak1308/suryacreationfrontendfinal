import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../services/ProductService";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then((data) => {
      // 🔒 ensure occasion always exists
      setProduct({
        ...data,
        occasion: data.occasion || "",
      });
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

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
      name: product.name,
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
      occasion: product.occasion || null, // ✅ optional
      variants: product.variants.map((v) => ({
        variantType: v.variantType,
        variantValue: v.variantValue,
        shape: v.shape,
        size: v.size,
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

        {/* BASIC INFO */}
        <input
          placeholder="Product name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <input
          placeholder="Category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

        <input
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
        />

        {/* OCCASION */}
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

        {/* DESCRIPTION */}
        <textarea
          placeholder="Product description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        {/* VARIANTS */}
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
            <button onClick={() => removeVariant(index)}>Remove</button>
          </div>
        ))}

        <button onClick={addVariant}>+ Add Variant</button>

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </>
  );
};

export default EditProduct;
