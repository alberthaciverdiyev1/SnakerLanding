const { supportedLocales, defaultLocale, isSupported } = require('../config/locales');
const { pricingPlans, businessPlan } = require('../config/pricing');
const { themesList } = require('../config/themes');
const { faqData } = require('../config/faq');
const fs = require('fs');
const path = require('path');

const locales = {
  az: require('../locales/az.json'),
  en: require('../locales/en.json'),
  ru: require('../locales/ru.json'),
  tr: require('../locales/tr.json')
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function sanitizeLeadValue(value) {
  return String(value || '').trim().slice(0, 2000);
}

function captureLead(type, payload) {
  const dataDir = path.join(__dirname, '../../data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.appendFileSync(
    path.join(dataDir, 'leads.ndjson'),
    `${JSON.stringify({
      type,
      createdAt: new Date().toISOString(),
      ...payload
    })}\n`
  );
}

// Helper to generate language switcher items preserving current route subpath
function buildLanguages(currentLang, subPath = '') {
  const normalizedSubPath = subPath ? (subPath.startsWith('/') ? subPath : `/${subPath}`) : '';
  return supportedLocales.map(l => ({
    code: l.code,
    label: l.label,
    name: l.name,
    active: l.code === currentLang,
    url: `/${l.code}${normalizedSubPath}`
  }));
}

// Controller handlers
const pagesController = {
  home: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/home', {
      currentLang: lang,
      currentPath: '',
      pageTitle: locale.meta.title,
      metaDescription: locale.meta.description,
      languages: buildLanguages(lang, ''),
      pricingPlans,
      businessPlan,
      themesList,
      faqs: faqData[lang] || faqData[defaultLocale]
    });
  },

  pricing: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/pricing', {
      currentLang: lang,
      currentPath: '/pricing',
      pageTitle: `${locale.nav.pricing} — Snaker`,
      metaDescription: locale.pricing.subtitle,
      languages: buildLanguages(lang, '/pricing'),
      pricingPlans,
      businessPlan,
      faqs: faqData[lang] || faqData[defaultLocale]
    });
  },

  themes: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/themes', {
      currentLang: lang,
      currentPath: '/themes',
      pageTitle: `${locale.nav.themes} — Snaker`,
      metaDescription: locale.themesPage.lead,
      languages: buildLanguages(lang, '/themes'),
      themesList
    });
  },

  business: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/business', {
      currentLang: lang,
      currentPath: '/business',
      pageTitle: `Snaker Business — ${locale.businessPage.title}`,
      metaDescription: locale.businessPage.lead,
      languages: buildLanguages(lang, '/business'),
      businessPlan
    });
  },

  demo: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/demo', {
      currentLang: lang,
      currentPath: '/demo',
      pageTitle: `${locale.nav.demo} — Snaker`,
      metaDescription: locale.demoPage.lead,
      languages: buildLanguages(lang, '/demo')
    });
  },

  faq: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/faq', {
      currentLang: lang,
      currentPath: '/faq',
      pageTitle: `${locale.nav.faq} — Snaker`,
      metaDescription: (locale.faq && locale.faq.subtitle) || locale.meta.description,
      languages: buildLanguages(lang, '/faq'),
      faqs: faqData[lang] || faqData[defaultLocale]
    });
  },

  about: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/about', {
      currentLang: lang,
      currentPath: '/about',
      pageTitle: `${locale.nav.about} — Snaker`,
      metaDescription: locale.aboutPage.lead,
      languages: buildLanguages(lang, '/about')
    });
  },

  contact: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/contact', {
      currentLang: lang,
      currentPath: '/contact',
      pageTitle: `${locale.nav.contact} — Snaker`,
      metaDescription: locale.contactPage.lead,
      languages: buildLanguages(lang, '/contact')
    });
  },

  privacy: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/privacy', {
      currentLang: lang,
      currentPath: '/privacy',
      pageTitle: `${locale.footer.privacy} — Snaker`,
      metaDescription: locale.legal.privacyLead,
      languages: buildLanguages(lang, '/privacy')
    });
  },

  terms: (req, res) => {
    const lang = req.lang;
    const locale = locales[lang] || locales[defaultLocale];
    res.render('pages/terms', {
      currentLang: lang,
      currentPath: '/terms',
      pageTitle: `${locale.footer.terms} — Snaker`,
      metaDescription: locale.legal.termsLead,
      languages: buildLanguages(lang, '/terms')
    });
  },

  // API Handlers
  postDemo: (req, res) => {
    const { name, email, store_name, selling_category, website, message, lang = 'az' } = req.body;
    if (!isValidEmail(email) || !sanitizeLeadValue(name)) {
      const errMap = {
        az: 'Zəhmət olmasa adınızı və düzgün e-poçt ünvanınızı qeyd edin.',
        en: 'Please provide your name and a valid email address.',
        ru: 'Пожалуйста, укажите имя и корректный адрес электронной почты.',
        tr: 'Lütfen adınızı ve geçerli bir e-posta adresi belirtin.'
      };
      return res.status(400).json({ error: errMap[lang] || errMap.az });
    }

    captureLead('demo', {
      lang: isSupported(lang) ? lang : defaultLocale,
      name: sanitizeLeadValue(name),
      email: sanitizeLeadValue(email),
      storeName: sanitizeLeadValue(store_name),
      sellingCategory: sanitizeLeadValue(selling_category),
      website: sanitizeLeadValue(website),
      message: sanitizeLeadValue(message)
    });

    const successMap = {
      az: `Təşəkkür edirik, ${name}. Məlumatlarınız qeydə alındı, komandamız qısa zamanda sizinlə əlaqə saxlayacaq.`,
      en: `Thank you, ${name}. Your request has been received. Our team will reach out shortly.`,
      ru: `Спасибо, ${name}. Ваша заявка принята, мы свяжемся с вами в ближайшее время.`,
      tr: `Teşekkürler, ${name}. Talebiniz alındı, ekibimiz en kısa sürede sizinle iletişime geçecektir.`
    };

    return res.json({
      success: true,
      message: successMap[lang] || successMap.az
    });
  },

  postContact: (req, res) => {
    const { name, email, subject, message, lang = 'az' } = req.body;
    if (!isValidEmail(email) || !sanitizeLeadValue(name) || !sanitizeLeadValue(message)) {
      const errMap = {
        az: 'Zəhmət olmasa bütün tələb olunan xanaları doldurun.',
        en: 'Please fill in all required fields.',
        ru: 'Пожалуйста, заполните все обязательные поля.',
        tr: 'Lütfen tüm zorunlu alanları doldurun.'
      };
      return res.status(400).json({ error: errMap[lang] || errMap.az });
    }

    captureLead('contact', {
      lang: isSupported(lang) ? lang : defaultLocale,
      name: sanitizeLeadValue(name),
      email: sanitizeLeadValue(email),
      subject: sanitizeLeadValue(subject),
      message: sanitizeLeadValue(message)
    });

    const successMap = {
      az: `Mesajınız çatdırıldı, ${name}. Tezliklə cavablandıracağıq.`,
      en: `Message received, ${name}. We will get back to you shortly.`,
      ru: `Сообщение получено, ${name}. Мы ответим в ближайшее время.`,
      tr: `Mesajınız alındı, ${name}. En kısa sürede yanıtlayacağız.`
    };

    return res.json({
      success: true,
      message: successMap[lang] || successMap.az
    });
  }
};

module.exports = pagesController;
