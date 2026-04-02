const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Service title is required'],
      trim:      true,
      maxlength: [80, 'Title cannot exceed 80 characters'],
    },
    shortDescription: {
      type:      String,
      required:  [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    description: {
      type:     String,
      required: [true, 'Full description is required'],
    },
    // e.g. ['4K export', 'Color graded', 'Custom intro']
    deliverables: [String],

    pricingNote: String,  // e.g. "Starting at $150"
    turnaround:  String,  // e.g. "3–5 business days"

    // Lucide icon name or custom SVG string
    icon: {
      type:    String,
      default: 'video',
    },
    image: {
      url:      String,
      publicId: String,
    },
    order: {
      type:    Number,
      default: 0,
    },
    active: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);