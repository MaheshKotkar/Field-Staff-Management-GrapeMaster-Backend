const express = require('express');
const router = express.Router();
const {
    getFarmers,
    getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer,
} = require('../controllers/farmerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFarmers).post(protect, createFarmer);
router.route('/:id')
    .get(protect, getFarmerById)
    .put(protect, updateFarmer)
    .delete(protect, deleteFarmer);

module.exports = router;
