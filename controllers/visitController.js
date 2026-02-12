const Visit = require('../models/Visit');
const { notifyAdmins } = require('./notificationController');
const Farmer = require('../models/Farmer');

// @desc    Get all visits
// @route   GET /api/visits
// @access  Private
const getVisits = async (req, res) => {
    try {
        let query = {};
        // If user is staff, only show visits they conducted
        if (req.user && req.user.role === 'staff') {
            query.consultant = req.user._id;
        }

        const visits = await Visit.find(query)
            .populate('consultant', 'name')
            .populate('farmer', 'name');
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single visit
// @route   GET /api/visits/:id
// @access  Private
const getVisitById = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id)
            .populate('consultant', 'name')
            .populate('farmer', 'name');

        if (visit) {
            // Check if user is staff and if they are the consultant
            if (req.user.role === 'staff' && visit.consultant._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to view this visit' });
            }
            res.json(visit);
        } else {
            res.status(404).json({ message: 'Visit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a visit
// @route   POST /api/visits
// @access  Private
const createVisit = async (req, res) => {
    const {
        farmerId,
        locationAddress,
        remarks,
        visitDate,
        cropType,
        cropStage,
        fieldCondition,
        recommendation
    } = req.body;

    console.log('DEBUG: Create Visit Body:', JSON.stringify(req.body, null, 2));

    try {
        const visit = new Visit({
            consultant: req.user._id,
            farmer: farmerId,
            locationAddress,
            remarks,
            visitDate: visitDate || Date.now(),
            cropType,
            cropStage,
            fieldCondition,
            recommendation
        });

        const createdVisit = await visit.save();

        // Notify Admins
        const farmer = await Farmer.findById(farmerId);
        await notifyAdmins({
            type: 'visit',
            title: 'New Farm Visit Logged',
            message: `${req.user.name} logged a visit for ${farmer?.name || 'a farmer'}`,
            metadata: {
                id: createdVisit._id,
                staffName: req.user.name,
                staffId: req.user._id
            }
        });

        res.status(201).json(createdVisit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVisits, getVisitById, createVisit };
