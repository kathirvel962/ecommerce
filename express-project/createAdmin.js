require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/User');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      
      // Update existing user to be admin
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('Updated existing user to admin role');
      
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      isAdmin: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.connection.close();
  }
}

createAdmin();
