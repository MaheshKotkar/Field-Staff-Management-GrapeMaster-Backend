const express = require('express');
const router = express.Router();
const {
    getDailyStats,
    submitDailyReport,
    getAllDailyReports
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, submitDailyReport);

router.get('/daily-stats', protect, getDailyStats);
router.get('/admin', protect, admin, getAllDailyReports);

module.exports = router;
