const mongoose = require('mongoose');

const visitSchema = mongoose.Schema(
    {
        consultant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Farmer',
        },
        visitDate: {
            type: Date,
            default: Date.now,
        },
        locationAddress: {
            type: String,
            required: true,
        },
        cropType: {
            type: String,
        },
        cropStage: {
            type: String,
        },
        fieldCondition: {
            type: String,
        },
        recommendation: {
            fertilizer: String,
            pesticide: String,
            notes: String
        },
        remarks: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
