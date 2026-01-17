import { useState } from "react";
import { createProduct } from "../services/ProductService";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    imageUrl: "",
    description: "",
    occasion: "",
    variants: [],

    // ✅ MOQ (NEW)
    enforceMinQuantity: false,
    minOrderQuantity: "",
  });

  /* ================= VARIANTS ================= */
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

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index][field] = value;
    setProduct({ ...product, variants: updatedVariants });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        ...product,
        minOrderQuantity: product.enforceMinQuantity
          ? Number(product.minOrderQuantity)
          : null,
      };

      await createProduct(payload);

      alert("Product added successfully");

      setProduct({
        name: "",
        category: "",
        imageUrl: "",
        description: "",
        occasion: "",
        variants: [],
        enforceMinQuantity: false,
        minOrderQuantity: "",
      });
    } catch (error) {
      alert("Error adding product");
      console.error(error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-container">
        <h2>Add Product</h2>

        <input
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <input
          placeholder="Category (slug format)"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

        {/* ================= OCCASION ================= */}
        <div className="form-group">
          <select
            value={product.occasion}
            onChange={(e) =>
              setProduct({ ...product, occasion: e.target.value })
            }
          >
            <option value="">Select occasion</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="corporate">Corporate</option>
            <option value="decor">Home Décor</option>
            <option value="stationery">Stationery</option>
          </select>
        </div>

        <input
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
        />

        <textarea
          placeholder="Description"
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
              placeholder="Variant Type"
              onChange={(e) =>
                updateVariant(index, "variantType", e.target.value)
              }
            />
            <input
              placeholder="Variant Value"
              onChange={(e) =>
                updateVariant(index, "variantValue", e.target.value)
              }
            />
            <input
              placeholder="Shape"
              onChange={(e) => updateVariant(index, "shape", e.target.value)}
            />
            <input
              placeholder="Size"
              onChange={(e) => updateVariant(index, "size", e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              onChange={(e) => updateVariant(index, "quantity", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              onChange={(e) => updateVariant(index, "price", e.target.value)}
            />
          </div>
        ))}

        <button onClick={addVariant}>+ Add Variant</button>

        <button className="save-btn" onClick={handleSubmit}>
          Save Product
        </button>
      </div>
    </>
  );
};

export default AddProduct;
