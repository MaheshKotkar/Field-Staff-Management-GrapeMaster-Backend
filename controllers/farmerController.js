const Farmer = require('../models/Farmer');
const { notifyAdmins } = require('./notificationController');

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Private
const getFarmers = async (req, res) => {
    try {
        let query = {};
        // If user is staff, only show farmers they created
        if (req.user && req.user.role === 'staff') {
            query.createdBy = req.user._id;
        }

        const farmers = await Farmer.find(query).populate('createdBy', 'name');
        res.json(farmers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single farmer
// @route   GET /api/farmers/:id
// @access  Private
const getFarmerById = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id).populate('createdBy', 'name');

        if (farmer) {
            // Check if user is staff and if they are the creator
            if (req.user.role === 'staff' && farmer.createdBy._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to view this farmer' });
            }
            res.json(farmer);
        } else {
            res.status(404).json({ message: 'Farmer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a farmer
// @route   POST /api/farmers
// @access  Private
const createFarmer = async (req, res) => {
    const { name, contact, village, taluka, district, state } = req.body;

    try {
        const farmer = new Farmer({
            name,
            contact,
            village,
            taluka,
            district,
            state,
            createdBy: req.user._id,
        });

        const createdFarmer = await farmer.save();

        // Notify Admins
        await notifyAdmins({
            type: 'farmer',
            title: 'New Farmer Registered',
            message: `${req.user.name} registered a new farmer: ${name} from ${village}`,
            metadata: {
                id: createdFarmer._id,
                staffName: req.user.name,
                staffId: req.user._id
            }
        });

        res.status(201).json(createdFarmer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a farmer
// @route   PUT /api/farmers/:id
// @access  Private
const updateFarmer = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);

        if (farmer) {
            // Check if user is staff and if they are the creator
            if (req.user.role === 'staff' && farmer.createdBy.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this farmer' });
            }

            farmer.name = req.body.name || farmer.name;
            farmer.contact = req.body.contact || farmer.contact;
            farmer.village = req.body.village || farmer.village;
            farmer.taluka = req.body.taluka || farmer.taluka;
            farmer.district = req.body.district || farmer.district;
            farmer.state = req.body.state || farmer.state;

            const updatedFarmer = await farmer.save();
            res.json(updatedFarmer);
        } else {
            res.status(404).json({ message: 'Farmer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a farmer
// @route   DELETE /api/farmers/:id
// @access  Private
const deleteFarmer = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);

        if (farmer) {
            // Check if user is staff and if they are the creator
            if (req.user.role === 'staff' && farmer.createdBy.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this farmer' });
            }

            await farmer.deleteOne();
            res.json({ message: 'Farmer removed' });
        } else {
            res.status(404).json({ message: 'Farmer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFarmers, getFarmerById, createFarmer, updateFarmer, deleteFarmer };
