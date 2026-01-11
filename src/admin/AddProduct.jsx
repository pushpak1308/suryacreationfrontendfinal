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
    variants: [],
  });

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

  const handleSubmit = async () => {
    try {
      await createProduct(product);
      alert("Product added successfully");
      setProduct({
        name: "",
        category: "",
        imageUrl: "",
        description: "",
        occasion: "",
        variants: [],
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
          placeholder="Category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

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
