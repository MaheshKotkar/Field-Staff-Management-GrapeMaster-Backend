const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['farmer', 'visit', 'report'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        id: mongoose.Schema.Types.ObjectId,
        staffName: String,
        staffId: mongoose.Schema.Types.ObjectId
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
