const express = require('express');
const router = express.Router();
const { 
  insertFavoriteReceiver, 
  getFavoriteReceiversByUserId, 
  updateFavoriteReceiver, 
  deleteFavoriteReceiver 
} = require('../model/favoriteReceiverModel');
const { getAccountIdByAccountNumber } = require('../model/bankAccountModel');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware');

router.use(verifyTokenMiddleware);

// POST: Add a favorite receiver
router.post('/favorite-receiver', async (req, res) => {
  const { receiver_name, receiver_account_number, favorite_nickname, amount } = req.body;
  const user_id = req.user.user_id;

  if (!user_id || !receiver_name || !receiver_account_number || !favorite_nickname || amount === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Check if the account exists
    const receiver_account_id = await getAccountIdByAccountNumber(receiver_account_number);

    if (!receiver_account_id) {
      // Account does not exist, return 404
      return res.status(404).json({ success: false, message: 'Bank account not found' });
    }

    await insertFavoriteReceiver({
      user_id,
      receiver_account_id,
      receiver_name,
      receiver_account_number,
      favorite_nickname,
      amount
    });
    res.json({ success: true, message: 'Favorite receiver saved successfully' });
  } catch (error) {
    console.error('Error saving favorite receiver:', error);
    res.status(500).json({ success: false, message: 'Failed to save favorite receiver' });
  }
});

// GET: Fetch all favorite receivers for the current user
router.get('/favorite-receivers', async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const favorites = await getFavoriteReceiversByUserId(user_id);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorite receivers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch favorite receivers' });
  }
});

// PUT: Update a favorite receiver
router.put('/favorite-receiver/:favorite_receiver_id', async (req, res) => {
  try {
    await updateFavoriteReceiver(req.params.favorite_receiver_id, req.body);
    res.json({ success: true, message: 'Favorite receiver updated successfully' });
  } catch (error) {
    console.error('Error updating favorite receiver:', error);
    res.status(500).json({ success: false, message: 'Failed to update favorite receiver', error: error.message });
  }
});

// DELETE: Delete a favorite receiver
router.delete('/favorite-receiver/:favorite_receiver_id', async (req, res) => {
  try {
    await deleteFavoriteReceiver(req.params.favorite_receiver_id);
    res.json({ success: true, message: 'Favorite receiver deleted successfully' });
  } catch (error) {
    console.error('Error deleting favorite receiver:', error);
    res.status(500).json({ success: false, message: 'Failed to delete favorite receiver' });
  }
});

module.exports = router;