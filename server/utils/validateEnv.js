// Validates required environment variables on startup — fail fast

const REQUIRED_VARS = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   → ${key}`));
    console.error('\n💡 Copy .env.example to .env and fill in all values.\n');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
};

module.exports = { validateEnv };