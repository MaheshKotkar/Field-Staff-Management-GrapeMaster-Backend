const express = require('express');
const router = express.Router();
const {
    getRecommendationsByVisitId,
    createRecommendation,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRecommendation);
router.route('/:visitId').get(protect, getRecommendationsByVisitId);

module.exports = router;
