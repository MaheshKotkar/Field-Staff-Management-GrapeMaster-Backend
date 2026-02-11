const mongoose = require('mongoose');

const dailyReportSchema = mongoose.Schema(
    {
        consultant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        totalKm: {
            type: Number,
            required: true,
        },
        visitCount: {
            type: Number,
            required: true,
        },
        summary: {
            type: String,
        },
        status: {
            type: String,
            enum: ['submitted', 'verified'],
            default: 'submitted',
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one report per consultant per day
dailyReportSchema.index({ consultant: 1, date: 1 }, { unique: true });

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

module.exports = DailyReport;
