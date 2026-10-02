/**
 * Data-Driven Pricing Configuration
 * Structured according to actual product tiers (Free -> Subscription with 14-day trial -> Business)
 */

const pricingPlans = [
  {
    id: 'free',
    type: 'free',
    price: 0,
    trialDays: 0,
    popular: false,
    orderFlow: 'whatsapp',
    ctaKey: 'pricing.freeCta'
  },
  {
    id: 'premium',
    type: 'subscription',
    price: null, // Configurable or contact
    trialDays: 14,
    popular: true,
    orderFlow: 'direct_checkout',
    ctaKey: 'pricing.premiumCta'
  }
];

const businessPlan = {
  id: 'business',
  type: 'business',
  contactSales: true,
  ctaKey: 'pricing.businessCta'
};

module.exports = {
  pricingPlans,
  businessPlan
};
