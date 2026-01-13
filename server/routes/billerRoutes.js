const express = require('express');
const router = express.Router();
const billersModel = require('../model/billersModel'); // Assuming you have the model set up for handling the DB interactions

// Route to get all active billers
router.get('/billers', async (req, res) => {
  try {
    console.log('Fetching billers...');
    const billers = await billersModel.getBillers(); // Get active billers using the model
    console.log('Billers fetched successfully:', billers);
    res.status(200).json({ success: true, billers: billers });  // Send success response with billers list
  } catch (err) {
    console.error('Error in /billers route:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Route to add a new biller
router.post('/add', async (req, res) => {
  try {
    const { biller_name, category, is_active = 1 } = req.body;  // Get biller data from the request body
    if (!biller_name) {
      return res.status(400).json({ success: false, message: 'Biller name is required' });
    }
    const newBiller = await billersModel.addBiller({ biller_name, category, is_active });  // Add biller using the model
    res.status(201).json({ success: true, biller: newBiller });  // Send success response with new biller
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });  // Send error response
  }
});

// Route to get a single biller by name (useful for fetching biller_id based on biller_name)
router.get('/biller-by-name/:biller_name', async (req, res) => {
  const { biller_name } = req.params;
  try {
    const biller = await billersModel.getBillerByName(biller_name); // Fetch biller by name from model
    if (!biller) {
      return res.status(404).json({ success: false, message: 'Biller not found' });
    }
    res.status(200).json({ success: true, biller });  // Return the biller (contains biller_id)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;