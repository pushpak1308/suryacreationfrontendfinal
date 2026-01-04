export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const addToCart = (item) => {
  const cart = getCart();

  const existing = cart.find(
    (c) =>
      c.productId === item.productId &&
      JSON.stringify(c.variant) === JSON.stringify(item.variant)
  );

  if (existing) {
    existing.cartQty += item.cartQty;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const updateCartQty = (index, newQty) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (newQty < 1) return;

  cart[index].cartQty = newQty;
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (index) => {
  const cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};

export const getCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((sum, item) => sum + item.cartQty, 0);
};

