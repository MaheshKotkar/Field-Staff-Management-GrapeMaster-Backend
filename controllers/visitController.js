const Visit = require('../models/Visit');

// @desc    Get all visits
// @route   GET /api/visits
// @access  Private
const getVisits = async (req, res) => {
    try {
        const visits = await Visit.find({})
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
        res.status(201).json(createdVisit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVisits, getVisitById, createVisit };
