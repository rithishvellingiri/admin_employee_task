const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Employee = require('./models/Employee');
const dotenv = require('dotenv');

dotenv.config();

const checkDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/admin_employee';
        console.log(`Connecting to ${mongoURI}...`);
        await mongoose.connect(mongoURI);
        
        const admins = await Admin.find({});
        const employees = await Employee.find({});
        
        console.log('--- ADMINS ---');
        console.log(JSON.stringify(admins, null, 2));
        
        console.log('\n--- EMPLOYEES ---');
        console.log(JSON.stringify(employees, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
};

checkDB();
