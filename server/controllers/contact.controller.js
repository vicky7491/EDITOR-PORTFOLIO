const ContactInquiry = require('../models/ContactInquiry.model');
const AppError       = require('../utils/AppError');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');
const { sendEmail, newInquiryEmailHTML } = require('../utils/sendEmail');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Submit contact form (public)
// @route   POST /api/contact
// @access  Public (rate limited)
// ─────────────────────────────────────────────────────────────────────────────
const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, budget, service } = req.body;

    const inquiry = await ContactInquiry.create({
      name, email, phone, subject, message, budget, service,
      ipAddress: req.ip,
    });

    // Notify admin via email (non-blocking — failure doesn't affect response)
    if (process.env.EMAIL_USER) {
      sendEmail({
        to:      process.env.EMAIL_USER,
        subject: `📬 New Inquiry from ${name} — CineEdit`,
        html:    newInquiryEmailHTML(inquiry),
      });
    }

    return sendSuccess(
      res, 201,
      'Your message has been sent! I will get back to you within 24 hours.',
      { id: inquiry._id }
    );

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all inquiries (admin)
// @route   GET /api/contact/inquiries
// @access  Admin
// Query: page, limit, status, search
// ─────────────────────────────────────────────────────────────────────────────
const getAllInquiries = async (req, res, next) => {
  try {
    const {
      page   = 1,
      limit  = 20,
      status,
      search,
      sort   = '-createdAt',
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await ContactInquiry.countDocuments(filter);

    const inquiries = await ContactInquiry.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-ipAddress -__v');

    return sendSuccess(
      res, 200, 'Inquiries retrieved',
      inquiries,
      paginationMeta(total, page, limit)
    );

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single inquiry by ID (admin)
// @route   GET /api/contact/inquiries/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id)
      .select('-ipAddress -__v');

    if (!inquiry) return next(new AppError('Inquiry not found', 404));

    // Auto-mark as read when admin opens it
    if (inquiry.status === 'unread') {
      inquiry.status = 'read';
      await inquiry.save();
    }

    return sendSuccess(res, 200, 'Inquiry retrieved', inquiry);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update inquiry status (admin)
// @route   PATCH /api/contact/inquiries/:id/status
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-ipAddress -__v');

    if (!inquiry) return next(new AppError('Inquiry not found', 404));

    return sendSuccess(res, 200, `Inquiry marked as ${status}`, inquiry);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add admin note to inquiry
// @route   PATCH /api/contact/inquiries/:id/note
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const addAdminNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note) return next(new AppError('Note content is required', 400));

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { adminNotes: note },
      { new: true }
    ).select('+adminNotes -ipAddress -__v');

    if (!inquiry) return next(new AppError('Inquiry not found', 404));

    return sendSuccess(res, 200, 'Note saved', inquiry);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete inquiry (admin)
// @route   DELETE /api/contact/inquiries/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) return next(new AppError('Inquiry not found', 404));

    await inquiry.deleteOne();
    return sendSuccess(res, 200, 'Inquiry deleted');

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get inquiry stats (admin)
// @route   GET /api/contact/inquiries/stats
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getInquiryStats = async (req, res, next) => {
  try {
    const [total, unread, read, replied] = await Promise.all([
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: 'unread' }),
      ContactInquiry.countDocuments({ status: 'read'   }),
      ContactInquiry.countDocuments({ status: 'replied' }),
    ]);

    return sendSuccess(res, 200, 'Inquiry stats retrieved', {
      total, unread, read, replied,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  addAdminNote,
  deleteInquiry,
  getInquiryStats,
};