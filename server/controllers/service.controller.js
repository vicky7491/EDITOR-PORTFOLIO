const Service  = require('../models/Service.model');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { deleteFromCloudinary } = require('../utils/cloudinaryHelpers');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all active services (public)
// @route   GET /api/services
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getAllServices = async (req, res, next) => {
  try {
    // Public sees only active services; admin GET passes ?all=true
    const filter = req.query.all === 'true' && req.admin ? {} : { active: true };

    const services = await Service.find(filter)
      .sort('order')
      .select('-__v');

    return sendSuccess(res, 200, 'Services retrieved', services);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single service by ID (public)
// @route   GET /api/services/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).select('-__v');
    if (!service) return next(new AppError('Service not found', 404));
    return sendSuccess(res, 200, 'Service retrieved', service);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create service (admin)
// @route   POST /api/services
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    return sendSuccess(res, 201, 'Service created', service);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update service (admin)
// @route   PUT /api/services/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return next(new AppError('Service not found', 404));

    // Delete old image from Cloudinary if replacing
    if (req.body.image?.publicId &&
        service.image?.publicId &&
        req.body.image.publicId !== service.image.publicId) {
      await deleteFromCloudinary(service.image.publicId, 'image');
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    return sendSuccess(res, 200, 'Service updated', updated);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Toggle service active/inactive
// @route   PATCH /api/services/:id/toggle
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const toggleServiceActive = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return next(new AppError('Service not found', 404));

    service.active = !service.active;
    await service.save();

    return sendSuccess(res, 200, `Service ${service.active ? 'activated' : 'deactivated'}`, service);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete service (admin)
// @route   DELETE /api/services/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return next(new AppError('Service not found', 404));

    if (service.image?.publicId) {
      await deleteFromCloudinary(service.image.publicId, 'image');
    }

    await service.deleteOne();
    return sendSuccess(res, 200, 'Service deleted');

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Batch reorder services
// @route   PATCH /api/services/reorder/batch
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const reorderServices = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError('Items array is required', 400));
    }

    const bulkOps = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));

    await Service.bulkWrite(bulkOps);
    return sendSuccess(res, 200, 'Services reordered');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  reorderServices,
};