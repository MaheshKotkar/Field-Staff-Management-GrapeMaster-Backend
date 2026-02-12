const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Your message has been sent successfully! We will get back to you soon.'
        });
    } catch (err) {
        console.error('Contact form error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error. Please try again later.'
        });
    }
});

module.exports = router;
