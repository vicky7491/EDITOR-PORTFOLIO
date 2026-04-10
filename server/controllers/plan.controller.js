const PricingPlan = require('../models/PricingPlan.model');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await PricingPlan.find({ isActive: true }).sort({ order: 1 });
    sendSuccess(res, 200, 'Plans fetched', plans);
  } catch (err) { next(err); }
};

exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await PricingPlan.find().sort({ order: 1 });
    sendSuccess(res, 200, 'Plans fetched', plans);
  } catch (err) { next(err); }
};

exports.createPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.create(req.body);
    sendSuccess(res, 201, 'Plan created', plan);
  } catch (err) { next(err); }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!plan) return next(new AppError('Plan not found', 404));
    sendSuccess(res, 200, 'Plan updated', plan);
  } catch (err) { next(err); }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!plan) return next(new AppError('Plan not found', 404));
    sendSuccess(res, 200, 'Plan deleted', null);
  } catch (err) { next(err); }
};