const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const Image = require('../models/Image');
const { protect } = require('../middleware/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'field-staff-management',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage: storage });

router.post('/', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('MULTER UPLOAD ERROR:', err);
            return res.status(500).json({ message: err.message || 'Multer upload failed' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { visitId } = req.body;

        // Save to Image model if visitId is provided
        if (visitId && req.file) {
            const image = new Image({
                visit: visitId,
                imageUrl: req.file.path
            });
            await image.save();
        }

        res.status(201).json({
            imageUrl: req.file ? req.file.path : null,
            message: 'Image uploaded successfully',
        });
    } catch (error) {
        console.error('SERVER UPLOAD ERROR:', error);
        res.status(500).json({ message: error.message || 'Image upload failed' });
    }
});

module.exports = router;
