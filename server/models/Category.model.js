const mongoose = require('mongoose');
const slugify  = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Category name is required'],
      unique:   true,
      trim:     true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type:   String,
      unique: true,
    },
    description: {
      type:      String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    color: {
      type:    String,
      default: '#6366f1', // Default indigo — used for filter pills in the UI
      match:   [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'],
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

// Auto-generate slug from name before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);