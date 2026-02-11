const mongoose = require('mongoose');

const imageSchema = mongoose.Schema(
    {
        visit: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Visit',
        },
        imageUrl: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
