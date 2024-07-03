export const addItemToCart = async (cartId, variantId, quantity) => {
  const response = await fetch('/api/shopify-add-to-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cartId, variantId, quantity })
  });

  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }

  const updatedCart = await response.json();
  console.log('Updated cart:', updatedCart);
  return updatedCart;
};
