import createCart from '../../utils/createCart';

export default async function handler(req, res) {
  try {
    const newCartData = await createCart();
    res.status(200).json(newCartData);
  } catch (error) {
    console.error('Error in API create-cart:', error);
    res.status(500).json({ error: 'Error creating cart' });
  }
}
