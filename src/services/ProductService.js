const API_URL = "https://surya-creations.onrender.com/api/products";

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
};

export const getAllProducts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};
