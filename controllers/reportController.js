const DailyReport = require('../models/DailyReport');
const Visit = require('../models/Visit');
const { notifyAdmins } = require('./notificationController');

// @desc    Calculate daily stats for a consultant
// @route   GET /api/reports/daily-stats
// @access  Private
const getDailyStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const visitCount = await Visit.countDocuments({
            consultant: req.user._id,
            visitDate: { $gte: today }
        });

        const existingReport = await DailyReport.findOne({
            consultant: req.user._id,
            date: { $gte: today }
        });

        res.json({
            visitCount,
            isSubmitted: !!existingReport,
            report: existingReport
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit EOD report
// @route   POST /api/reports
// @access  Private
const submitDailyReport = async (req, res) => {
    try {
        const { totalKm, summary, visitCount } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if report already exists for today
        const existingReport = await DailyReport.findOne({
            consultant: req.user._id,
            date: { $gte: today }
        });

        if (existingReport) {
            return res.status(400).json({ message: 'Daily report already submitted for today' });
        }

        const report = new DailyReport({
            consultant: req.user._id,
            date: today,
            totalKm,
            visitCount,
            summary
        });

        const createdReport = await report.save();

        // Notify Admins
        await notifyAdmins({
            type: 'report',
            title: 'New Daily Summary Submitted',
            message: `${req.user.name} submitted their daily report with ${visitCount} visits and ${totalKm} KM covered.`,
            metadata: {
                id: createdReport._id,
                staffName: req.user.name,
                staffId: req.user._id
            }
        });

        res.status(201).json(createdReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all daily reports (Admin Only)
// @route   GET /api/reports/admin
// @access  Private/Admin
const getAllDailyReports = async (req, res) => {
    try {
        const reports = await DailyReport.find({})
            .populate('consultant', 'name email')
            .sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDailyStats,
    submitDailyReport,
    getAllDailyReports
};
