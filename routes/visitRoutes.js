const express = require('express');
const router = express.Router();
const {
    getVisits,
    getVisitById,
    createVisit,
} = require('../controllers/visitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVisits).post(protect, createVisit);
router.route('/:id').get(protect, getVisitById);

module.exports = router;
