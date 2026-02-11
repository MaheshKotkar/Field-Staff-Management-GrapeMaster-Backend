const Recommendation = require('../models/Recommendation');

// @desc    Get recommendations for a visit
// @route   GET /api/recommendations/:visitId
// @access  Private
const getRecommendationsByVisitId = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({
            visit: req.params.visitId,
        });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a recommendation
// @route   POST /api/recommendations
// @access  Private
const createRecommendation = async (req, res) => {
    const { visitId, fertilizer, pesticide, notes } = req.body;

    try {
        const recommendation = new Recommendation({
            visit: visitId,
            fertilizer,
            pesticide,
            notes,
        });

        const createdRecommendation = await recommendation.save();
        res.status(201).json(createdRecommendation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecommendationsByVisitId, createRecommendation };
