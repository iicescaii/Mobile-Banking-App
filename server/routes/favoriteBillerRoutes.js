const express = require('express');
const router = express.Router();
const { insertFavorite, getFavoritesByUserId, updateFavorite, deleteFavorite } = require('../model/favoriteBillerModel');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware');

router.use(verifyTokenMiddleware);

// POST: Add a favorite biller
router.post('/favorite-biller', async (req, res) => {
  const {biller_id, biller_name, subscriber_account_number, subscriber_account_name, favorite_nickname } = req.body;
  const user_id = req.user.user_id;
  if (!user_id || !biller_id || !biller_name || !subscriber_account_number || !subscriber_account_name || !favorite_nickname) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  try {
    await insertFavorite({ user_id, biller_id, biller_name, subscriber_account_number, subscriber_account_name, favorite_nickname });
    res.json({ success: true, message: 'Favorite saved successfully' });
  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(500).json({ success: false, message: 'Failed to save favorite' });
  }
});

// GET: Fetch all favorite billers for the current user
router.get('/favorite-billers', async (req, res) => {
  try {
    console.log('Decoded user from token:', req.user); // <--- Add this
    const user_id = req.user.user_id; // user_id from JWT
    const favorites = await getFavoritesByUserId(user_id);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch favorites' });
  }
});

   router.put('/favorite-biller/:favorite_id', async (req, res) => {
     try {
       console.log('Updating favorite:', req.params.favorite_id, req.body);
       await updateFavorite(req.params.favorite_id, req.body);
       res.json({ success: true, message: 'Favorite updated successfully' });
     } catch (error) {
       console.error('Error updating favorite:', error);
       res.status(500).json({ success: false, message: 'Failed to update favorite', error: error.message });
     }
   });

router.delete('/favorite-biller/:favorite_id', async (req, res) => {
  try {
    await deleteFavorite(req.params.favorite_id);
    res.json({ success: true, message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ success: false, message: 'Failed to delete favorite' });
  }
});  

module.exports = router;