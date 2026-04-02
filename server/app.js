// Core Express application — middleware stack, routes, error handling

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const { globalRateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// ─── Route imports ────────────────────────────────────────
const authRoutes        = require('./routes/auth.routes');
const projectRoutes     = require('./routes/project.routes');
const videoRoutes       = require('./routes/video.routes');
const categoryRoutes    = require('./routes/category.routes');
const serviceRoutes     = require('./routes/service.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const contactRoutes     = require('./routes/contact.routes');
const settingsRoutes    = require('./routes/settings.routes');
const uploadRoutes      = require('./routes/upload.routes');
const dashboardRoutes   = require('./routes/dashboard.routes');

const app = express();

// ─── Security Middleware ──────────────────────────────────

// Set secure HTTP headers
app.use(helmet());

// CORS — allow only our known frontend origins
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean);

    // Allow requests with no origin (Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin} is not an allowed origin`));
    }
  },
  credentials: true,             // Allow cookies (httpOnly refresh token)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limit — 100 requests per 15 minutes per IP
app.use(globalRateLimiter);

// ─── General Middleware ───────────────────────────────────

// Parse JSON bodies (limit 10mb for base64 image previews)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies (needed for httpOnly refresh token)
app.use(cookieParser());

// Sanitize request data against MongoDB injection attacks
app.use(mongoSanitize());

// HTTP request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CineEdit API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────

app.use('/api/auth',         authRoutes);
app.use('/api/projects',     projectRoutes);
app.use('/api/videos',       videoRoutes);
app.use('/api/categories',   categoryRoutes);
app.use('/api/services',     serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact',      contactRoutes);
app.use('/api/settings',     settingsRoutes);

// Admin-only routes (all internally protected with middleware)
app.use('/api/admin/upload',    uploadRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// ─── 404 Handler ──────────────────────────────────────────

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ─── Global Error Handler ─────────────────────────────────

app.use(errorHandler);

module.exports = app;