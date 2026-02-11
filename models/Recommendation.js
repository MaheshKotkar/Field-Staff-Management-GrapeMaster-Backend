const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema(
    {
        visit: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Visit',
        },
        fertilizer: {
            type: String,
        },
        pesticide: {
            type: String,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
