const express = require('express');
const router = express.Router();
const {
    getDashboardMetrics,
    getAllVisitsForAdmin,
    updateVisitStatus,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/metrics', getDashboardMetrics);
router.get('/visits', getAllVisitsForAdmin);
router.patch('/visits/:id/verify', updateVisitStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
