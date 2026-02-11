const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const name = 'Admin User';
        const email = 'admin@fieldmaster.com';
        const password = 'adminpassword'; // Change this

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const admin = await User.create({
            name,
            email,
            password,
            role: 'admin'
        });

        console.log('Admin user created successfully');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
