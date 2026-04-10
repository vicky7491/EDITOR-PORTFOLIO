const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },        // "Basic"
    price:      { type: String, default: '' },                       // "$1499/month"
    priceLabel: { type: String, default: '' },                       // "15 short videos"
    badge:      { type: String, default: '' },                       // "Recommended"
    bestFor:    { type: String, default: '' },                       // "Best for coaches..."
    features:   [{ type: String }],                                  // bullet list
    isCustom:   { type: Boolean, default: false },                   // hides price, shows CTA only
    ctaText:    { type: String, default: 'Book A Call' },
    ctaLink:    { type: String, default: '/contact' },
    isActive:   { type: Boolean, default: true },
    order:      { type: Number,  default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);