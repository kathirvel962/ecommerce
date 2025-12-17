const express = require('express');
const {getCart, addToCart} = require('../controllers/cartController');
const router = express.Router();
router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Add delete logic here
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
});
module.exports = router;