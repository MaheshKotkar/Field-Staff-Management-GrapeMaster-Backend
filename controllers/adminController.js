const User = require('../models/User');
const Visit = require('../models/Visit');
const Recommendation = require('../models/Recommendation');
const Farmer = require('../models/Farmer');
const Image = require('../models/Image');

// @desc    Get dashboard metrics for admin
// @route   GET /api/admin/metrics
// @access  Private/Admin
const getDashboardMetrics = async (req, res) => {
    try {
        const totalStaff = await User.countDocuments({ role: 'staff' });
        const totalFarmers = await Farmer.countDocuments({});
        const totalVisits = await Visit.countDocuments({});
        const pendingVerifications = await Visit.countDocuments({ status: 'pending' });

        // Consultant-wise activity (Visits per consultant)
        const consultantActivity = await Visit.aggregate([
            {
                $group: {
                    _id: '$consultant',
                    visitCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'consultantInfo'
                }
            },
            { $unwind: '$consultantInfo' },
            {
                $project: {
                    name: '$consultantInfo.name',
                    email: '$consultantInfo.email',
                    visitCount: 1
                }
            }
        ]);

        // Enhanced Consultant Stats
        const consultantStats = await Promise.all(consultantActivity.map(async (ca) => {
            const uniqueFarmers = await Visit.distinct('farmer', { consultant: ca._id });
            const lastVisit = await Visit.findOne({ consultant: ca._id }).sort({ visitDate: -1 });

            // Count visits that have recommendations logged directly within them
            const visitsWithRecs = await Visit.countDocuments({
                consultant: ca._id,
                $or: [
                    { 'recommendation.fertilizer': { $exists: true, $ne: '' } },
                    { 'recommendation.pesticide': { $exists: true, $ne: '' } }
                ]
            });

            return {
                ...ca,
                uniqueFarmers: uniqueFarmers.length,
                lastVisitDate: lastVisit ? lastVisit.visitDate : null,
                averageRecs: ca.visitCount > 0 ? (visitsWithRecs / ca.visitCount).toFixed(1) : 0
            };
        }));

        // Visit Trends (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const visitTrends = await Visit.aggregate([
            {
                $match: {
                    visitDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitDate" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Region-wise coverage
        const regionalCoverage = await Farmer.aggregate([
            {
                $group: {
                    _id: '$district',
                    farmerCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    region: '$_id',
                    count: '$farmerCount',
                    _id: 0
                }
            }
        ]);

        // Recommendation trends (directly from Visits)
        const recommendationTrends = await Visit.aggregate([
            {
                $facet: {
                    fertilizers: [
                        { $match: { 'recommendation.fertilizer': { $exists: true, $ne: '' } } },
                        { $group: { _id: '$recommendation.fertilizer', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                    ],
                    pesticides: [
                        { $match: { 'recommendation.pesticide': { $exists: true, $ne: '' } } },
                        { $group: { _id: '$recommendation.pesticide', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                    ]
                }
            }
        ]);

        res.json({
            totals: {
                staff: totalStaff,
                farmers: totalFarmers,
                visits: totalVisits,
                pending: pendingVerifications
            },
            consultantActivity,
            consultantStats,
            visitTrends,
            regionalCoverage,
            recommendationTrends: recommendationTrends[0]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all visits with verification status for admin
// @route   GET /api/admin/visits
// @access  Private/Admin
const getAllVisitsForAdmin = async (req, res) => {
    try {
        const visits = await Visit.find({})
            .populate('consultant', 'name email')
            .populate('farmer', 'name village district taluka')
            .sort({ createdAt: -1 })
            .lean();

        // Enhance visits with images and recommendations
        const enhancedVisits = await Promise.all(visits.map(async (visit) => {
            const [images, recommendations] = await Promise.all([
                Image.find({ visit: visit._id }),
                Recommendation.find({ visit: visit._id })
            ]);
            return {
                ...visit,
                images: images.map(img => img.imageUrl),
                recommendations
            };
        }));

        res.json(enhancedVisits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify or reject a visit
// @route   PATCH /api/admin/visits/:id/verify
// @access  Private/Admin
const updateVisitStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        if (!['pending', 'verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const visit = await Visit.findById(req.params.id);

        if (visit) {
            visit.status = status;
            if (status === 'rejected') {
                visit.rejectionReason = rejectionReason || 'No reason provided';
            } else {
                visit.rejectionReason = undefined; // Clear reason if status changed to verified/pending
            }
            await visit.save();
            res.json(visit);
        } else {
            res.status(404).json({ message: 'Visit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardMetrics,
    getAllVisitsForAdmin,
    updateVisitStatus
};
