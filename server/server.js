// Entry point — boots the Express app and connects to MongoDB

const dotenv = require('dotenv');
dotenv.config();

const { validateEnv } = require('./utils/validateEnv');
validateEnv(); // Crash early if required env vars are missing

const { connectDB } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api\n`);
  });

  // Handle unhandled promise rejections — prevent server crash
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
  });
};

startServer();