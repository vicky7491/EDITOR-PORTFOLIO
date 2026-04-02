const SiteSettings = require('../models/SiteSettings.model');
const { sendSuccess } = require('../utils/apiResponse');
const { deleteFromCloudinary } = require('../utils/cloudinaryHelpers');

// Helper: get or create the singleton settings document
const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get public site settings
// @route   GET /api/settings
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    // Only expose fields safe for public consumption
    const publicData = {
      siteTitle:               settings.siteTitle,
      tagline:                 settings.tagline,
      logo:                    settings.logo,
      favicon:                 settings.favicon,
      hero:                    settings.hero,
      stats:                   settings.stats,
      aboutPreview:            settings.aboutPreview,
      showreelUrl:             settings.showreelUrl,
      socialLinks:             settings.socialLinks,
      contactInfo:             settings.contactInfo,
      seo:                     settings.seo,
      footerText:              settings.footerText,
      showTestimonialsSection: settings.showTestimonialsSection,
      showServicesSection:     settings.showServicesSection,
      showShowreelSection:     settings.showShowreelSection,
    };

    return sendSuccess(res, 200, 'Settings retrieved', publicData);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get full settings (admin)
// @route   GET /api/settings/admin
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    return sendSuccess(res, 200, 'Admin settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update entire settings document (admin)
// @route   PUT /api/settings
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    // Handle logo replacement — delete old from Cloudinary
    if (req.body.logo?.publicId && settings.logo?.publicId &&
        req.body.logo.publicId !== settings.logo.publicId) {
      await deleteFromCloudinary(settings.logo.publicId, 'image');
    }

    // Handle favicon replacement
    if (req.body.favicon?.publicId && settings.favicon?.publicId &&
        req.body.favicon.publicId !== settings.favicon.publicId) {
      await deleteFromCloudinary(settings.favicon.publicId, 'image');
    }

    // Use $set for deep merge — avoids wiping nested objects not in payload
    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Settings updated', updated);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update hero section only
// @route   PATCH /api/settings/hero
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateHeroSection = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: { hero: req.body } },
      { new: true }
    );

    return sendSuccess(res, 200, 'Hero section updated', updated.hero);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update social links only
// @route   PATCH /api/settings/social
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateSocialLinks = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: { socialLinks: req.body } },
      { new: true }
    );

    return sendSuccess(res, 200, 'Social links updated', updated.socialLinks);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update contact info only
// @route   PATCH /api/settings/contact
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateContactInfo = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: { contactInfo: req.body } },
      { new: true }
    );

    return sendSuccess(res, 200, 'Contact info updated', updated.contactInfo);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update SEO settings only
// @route   PATCH /api/settings/seo
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateSeoSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: { seo: req.body } },
      { new: true }
    );

    return sendSuccess(res, 200, 'SEO settings updated', updated.seo);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update homepage stats array
// @route   PATCH /api/settings/stats
// @access  Admin
// Body: { stats: [{ label, value }, ...] }
// ─────────────────────────────────────────────────────────────────────────────
const updateStats = async (req, res, next) => {
  try {
    const { stats } = req.body;
    if (!Array.isArray(stats)) {
      return res.status(400).json({ status: 'error', message: 'Stats must be an array' });
    }

    const settings = await getOrCreateSettings();

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: { stats } },
      { new: true }
    );

    return sendSuccess(res, 200, 'Stats updated', updated.stats);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
  updateHeroSection,
  updateSocialLinks,
  updateContactInfo,
  updateSeoSettings,
  updateStats,
};