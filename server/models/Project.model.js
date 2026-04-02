const mongoose = require('mongoose');
const slugify  = require('slugify');
const { PROJECT_STATUS } = require('../config/constants');

const mediaSchema = new mongoose.Schema({
  url:      { type: String, required: true },
  publicId: { type: String, required: true },
}, { _id: false });

const projectSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Project title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type:   String,
      unique: true,
    },
    thumbnail: mediaSchema,

    // Cloudinary-hosted video URL
    videoUrl:      String,
    videoPublicId: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Category',
    },
    shortDescription: {
      type:      String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    description: String,

    // e.g. ['Premiere Pro', 'After Effects', 'DaVinci Resolve']
    softwareUsed: [String],

    clientName:  String,
    projectDate: Date,
    tags:        [String],

    featured: {
      type:    Boolean,
      default: false,
    },
    order: {
      type:    Number,
      default: 0,
    },
    externalLink: String,

    // Before/After comparison images
    beforeAfter: {
      before: mediaSchema,
      after:  mediaSchema,
    },

    status: {
      type:    String,
      enum:    Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.DRAFT,
    },

    // Track view count for analytics
    views: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title
projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Populate category by default in queries
projectSchema.pre(/^find/, function (next) {
  this.populate('category', 'name slug color');
  next();
});

module.exports = mongoose.model('Project', projectSchema);