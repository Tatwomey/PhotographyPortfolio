import { createCheckout } from './shopify';

export const createCart = async (items) => {
  const checkout = await createCheckout(items);
  return checkout;
};
