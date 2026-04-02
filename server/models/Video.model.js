const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Video title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type:      String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    videoUrl: {
      type:     String,
      required: [true, 'Video URL is required'],
    },
    videoPublicId: String,

    thumbnail: {
      url:      String,
      publicId: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Category',
    },
    featured: {
      type:    Boolean,
      default: false,
    },
    order: {
      type:    Number,
      default: 0,
    },
    duration: String, // e.g. "2:34"
    views: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.pre(/^find/, function (next) {
  this.populate('category', 'name slug color');
  next();
});

module.exports = mongoose.model('Video', videoSchema);