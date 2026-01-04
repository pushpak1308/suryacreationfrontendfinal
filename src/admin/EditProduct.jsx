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
    getProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

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

  const handleSave = async () => {
    const payload = {
      name: product.name,
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
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
    alert("Product updated");
    navigate("/admin/products");
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        <h2>Edit Product</h2>

        <input
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <input
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

        <input
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
        />

        <textarea
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        <h3>Variants</h3>

        {product.variants.map((v, index) => (
          <div key={index} className="variant-box">
            <input
              value={v.variantType}
              onChange={(e) =>
                updateVariant(index, "variantType", e.target.value)
              }
            />
            <input
              value={v.variantValue}
              onChange={(e) =>
                updateVariant(index, "variantValue", e.target.value)
              }
            />
            <input
              value={v.shape}
              onChange={(e) => updateVariant(index, "shape", e.target.value)}
            />
            <input
              value={v.size}
              onChange={(e) => updateVariant(index, "size", e.target.value)}
            />
            <input
              type="number"
              value={v.quantity}
              onChange={(e) => updateVariant(index, "quantity", e.target.value)}
            />
            <input
              type="number"
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
