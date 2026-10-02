const express = require('express');
const router = express.Router();
const { defaultLocale, isSupported } = require('../config/locales');
const pagesController = require('../controllers/pagesController');

// Root redirect to default locale
router.get('/', (req, res) => {
  res.redirect(`/${defaultLocale}`);
});

// Middleware for language extraction and validation
const langMiddleware = (req, res, next) => {
  const lang = (req.params.lang || defaultLocale).toLowerCase();
  if (!isSupported(lang)) {
    return res.redirect(`/${defaultLocale}`);
  }
  req.lang = lang;
  next();
};

// Localized Page Routes
router.get('/:lang', langMiddleware, pagesController.home);
router.get('/:lang/pricing', langMiddleware, pagesController.pricing);
router.get('/:lang/themes', langMiddleware, pagesController.themes);
router.get('/:lang/business', langMiddleware, pagesController.business);
router.get('/:lang/demo', langMiddleware, pagesController.demo);
router.get('/:lang/faq', langMiddleware, pagesController.faq);
router.get('/:lang/about', langMiddleware, pagesController.about);
router.get('/:lang/contact', langMiddleware, pagesController.contact);

// Form / API Submission Routes
router.post('/request-demo', pagesController.postDemo);
router.post('/api/demo', pagesController.postDemo);
router.post('/api/contact', pagesController.postContact);

module.exports = router;
