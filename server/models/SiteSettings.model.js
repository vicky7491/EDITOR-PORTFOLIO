const mongoose = require('mongoose');

// Singleton model — only one document ever exists, fetched by findOne()

const ctaButtonSchema = new mongoose.Schema({
  label:   String,
  link:    String,
  variant: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' },
}, { _id: false });

const statSchema = new mongoose.Schema({
  label: String,
  value: String, // e.g. "150+" or "5 Years"
}, { _id: false });

const socialLinksSchema = new mongoose.Schema({
  instagram: String,
  youtube:   String,
  twitter:   String,
  linkedin:  String,
  behance:   String,
  vimeo:     String,
}, { _id: false });

const contactInfoSchema = new mongoose.Schema({
  email:    String,
  phone:    String,
  whatsapp: String,
  location: String,
}, { _id: false });

const seoSchema = new mongoose.Schema({
  defaultTitle: String,
  description:  String,
  keywords:     String,
  ogImage:      String,
}, { _id: false });

const siteSettingsSchema = new mongoose.Schema(
  {
    siteTitle:   { type: String, default: 'VickyVfx — Professional Video Editor' },
    tagline:     String,

    logo: {
      url:      String,
      publicId: String,
    },
    favicon: {
      url:      String,
      publicId: String,
    },

    // Homepage hero section
    hero: {
      title:      { type: String, default: 'Transforming Footage Into Cinematic Stories' },
      subtitle:   String,
      ctaButtons: [ctaButtonSchema],
    },

    // Stats bar on homepage (e.g. "150+ Projects", "5 Years Experience")
    stats: [statSchema],

    // Short about blurb on homepage
    aboutPreview: String,

    // Main showreel video URL
    showreelUrl: String,

    socialLinks:  socialLinksSchema,
    contactInfo:  contactInfoSchema,
    seo:          seoSchema,

    footerText: {
      type:    String,
      default: '© 2024 VickyVfx. All rights reserved.',
    },

    // Feature flags — turn sections on/off from admin
    showTestimonialsSection: { type: Boolean, default: true },
    showServicesSection:     { type: Boolean, default: true },
    showShowreelSection:     { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);