import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Adjust path if seeder is run from a different directory

const seedAdminUser = async () => {
  try {
    // await User.deleteMany({ role: 'admin' }); // Optional: clear existing admins

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD, // Password will be hashed by pre-save hook
        role: 'admin',
      });
      console.log('🔑 Admin user created successfully!'.blue.inverse);
    } else {
      console.log('ℹ️ Admin user already exists.'.blue);
    }
  } catch (error) {
    console.error(`Error seeding admin user: ${error.message}`.red);
  }
  // Do not call process.exit() here if you import it in server.js
};

// If running this file directly: node utils/seeder.js
// Make sure to connect to DB first if running standalone.
// For simplicity, this version is meant to be called from server.js after DB connection.

export default seedAdminUser;