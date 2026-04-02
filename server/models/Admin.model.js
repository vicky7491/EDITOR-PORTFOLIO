const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { ROLES } = require('../config/constants');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:   false, // Never returned in queries by default
    },
    role: {
      type:    String,
      enum:    Object.values(ROLES),
      default: ROLES.ADMIN,
    },
    // Store hashed refresh tokens for revocation (e.g., logout from all devices)
    refreshTokens: {
      type:   [String],
      select: false,
    },
    lastLogin: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

// ── Pre-save: hash password if modified ──────────────────────────────────────

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000; // Ensure token is issued after change
  next();
});

// ── Instance method: compare plain vs hashed password ────────────────────────

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: check if password changed after token was issued ─────────

adminSchema.methods.passwordChangedAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('Admin', adminSchema);