// Run once: `npm run seed` — creates the first admin account

const dotenv = require('dotenv');
dotenv.config();

const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const Admin     = require('../models/Admin.model');
const { connectDB } = require('../config/db');

const seed = async () => {
  await connectDB();

  const email    = process.env.ADMIN_EMAIL    || 'admin@cineedit.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await Admin.create({
    email,
    password: hashedPassword,
    role: 'admin',
  });

  console.log(`\n✅ Admin account created:`);
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Change this password immediately after first login!\n`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});