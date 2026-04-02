const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type:     String,
      required: [true, 'Client name is required'],
      trim:     true,
    },
    clientTitle:   String, // e.g. "CEO at BrandCo"
    company:       String,
    review: {
      type:     String,
      required: [true, 'Review text is required'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    rating: {
      type:    Number,
      min:     [1, 'Rating must be at least 1'],
      max:     [5, 'Rating cannot exceed 5'],
      default: 5,
    },
    photo: {
      url:      String,
      publicId: String,
    },
    videoTestimonialUrl: String,
    featured: {
      type:    Boolean,
      default: false,
    },
    order: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);