const Project        = require('../models/Project.model');
const Video          = require('../models/Video.model');
const Category       = require('../models/Category.model');
const Service        = require('../models/Service.model');
const Testimonial    = require('../models/Testimonial.model');
const ContactInquiry = require('../models/ContactInquiry.model');
const { sendSuccess } = require('../utils/apiResponse');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get dashboard stats — entity counts + unread inquiries
// @route   GET /api/admin/dashboard/stats
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    // Run all counts in parallel for speed
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalVideos,
      featuredVideos,
      totalCategories,
      totalServices,
      activeServices,
      totalTestimonials,
      totalInquiries,
      unreadInquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'published' }),
      Project.countDocuments({ status: 'draft' }),
      Video.countDocuments(),
      Video.countDocuments({ featured: true }),
      Category.countDocuments(),
      Service.countDocuments(),
      Service.countDocuments({ active: true }),
      Testimonial.countDocuments(),
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: 'unread' }),
    ]);

    return sendSuccess(res, 200, 'Dashboard stats retrieved', {
      projects: {
        total:     totalProjects,
        published: publishedProjects,
        draft:     draftProjects,
      },
      videos: {
        total:    totalVideos,
        featured: featuredVideos,
      },
      categories: { total: totalCategories },
      services: {
        total:  totalServices,
        active: activeServices,
      },
      testimonials: { total: totalTestimonials },
      inquiries: {
        total:  totalInquiries,
        unread: unreadInquiries,
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get recent activity feed
// @route   GET /api/admin/dashboard/activity
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getRecentActivity = async (req, res, next) => {
  try {
    const [recentProjects, recentInquiries, recentVideos] = await Promise.all([
      Project.find()
        .sort('-createdAt')
        .limit(5)
        .select('title status createdAt thumbnail featured'),

      ContactInquiry.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email subject status createdAt'),

      Video.find()
        .sort('-createdAt')
        .limit(5)
        .select('title featured createdAt thumbnail'),
    ]);

    return sendSuccess(res, 200, 'Recent activity retrieved', {
      recentProjects,
      recentInquiries,
      recentVideos,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get chart data — monthly inquiries + projects by category
// @route   GET /api/admin/dashboard/charts
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getChartData = async (req, res, next) => {
  try {
    // Monthly inquiries for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyInquiries = await ContactInquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id:   0,
          year:  '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
    ]);

    // Projects grouped by category
    const projectsByCategory = await Project.aggregate([
      { $match: { status: 'published', category: { $ne: null } } },
      {
        $group: {
          _id:   '$category',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from:         'categories',
          localField:   '_id',
          foreignField: '_id',
          as:           'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          _id:   0,
          name:  '$categoryInfo.name',
          color: '$categoryInfo.color',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Monthly projects created for the last 6 months
    const monthlyProjects = await Project.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id:   0,
          year:  '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
    ]);

    return sendSuccess(res, 200, 'Chart data retrieved', {
      monthlyInquiries,
      monthlyProjects,
      projectsByCategory,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getRecentActivity, getChartData };