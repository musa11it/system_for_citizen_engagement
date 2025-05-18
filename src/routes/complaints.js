const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const mongoose = require('mongoose');

// Submit new complaint
router.post('/', async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      status: 'pending',
      submissionDate: new Date()
    });
    await complaint.save();
    res.status(201).json({
      ...complaint.toJSON(),
      trackingId: complaint._id // Ensure we return the ID as trackingId
    });
  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ error: 'Failed to submit complaint', details: error.message });
  }
});

// Get complaint status by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let complaint;

    // Check if ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint = await Complaint.findById(id);
    }

    if (!complaint) {
      return res.status(404).json({ 
        error: 'Complaint not found. Please verify your tracking ID and try again.' 
      });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch complaint. Please try again later.' 
    });
  }
});

module.exports = router;