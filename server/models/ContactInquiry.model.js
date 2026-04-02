const mongoose = require('mongoose');
const { INQUIRY_STATUS } = require('../config/constants');

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      trim:     true,
      lowercase: true,
      match:    [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone:   String,
    subject: String,
    message: {
      type:     String,
      required: [true, 'Message is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    budget:  String, // e.g. "$500–$1000"
    service: String, // Which service they're interested in

    status: {
      type:    String,
      enum:    Object.values(INQUIRY_STATUS),
      default: INQUIRY_STATUS.UNREAD,
    },

    // Admin notes (not visible to client)
    adminNotes: {
      type:   String,
      select: false,
    },
    // IP for spam tracking (not exposed in API)
    ipAddress: {
      type:   String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);