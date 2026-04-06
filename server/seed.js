const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task_portal';
        console.log(`Connecting to MongoDB at ${mongoURI}...`);
        await mongoose.connect(mongoURI);
        
        const adminEmail = 'admin@example.com';
        const adminExists = await Admin.findOne({ email: adminEmail });
        
        if (adminExists) {
            console.log('Admin already exists');
        } else {
            const admin = new Admin({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123',
            });
            await admin.save();
            console.log('Admin user created successfully');
            console.log('Email: admin@example.com');
            console.log('Password: admin123');
        }
        
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedAdmin();
