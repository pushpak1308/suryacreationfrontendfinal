import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/ProductService";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadProducts();
  };

  if (loading) return <p className="admin-loading">Loading...</p>;

  return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        <h2>Product List</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Variants</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.variants?.length || 0}</td>
                <td>
                  <button
                    onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductList;
