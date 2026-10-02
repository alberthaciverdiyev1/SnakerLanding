const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Load translation dictionaries
const locales = {
  az: require('./locales/az.json'),
  en: require('./locales/en.json'),
  ru: require('./locales/ru.json'),
  tr: require('./locales/tr.json')
};

// Handlebars Engine Setup
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [
    path.join(__dirname, 'views/partials'),
    path.join(__dirname, 'views/components')
  ],
  helpers: {
    t: function(key, options) {
      const lang = (options && options.data && options.data.root && options.data.root.currentLang) || 'az';
      const dict = locales[lang] || locales.az;
      const keys = String(key).split('.');
      let val = dict;
      for (const k of keys) {
        if (val && val[k] !== undefined) {
          val = val[k];
        } else {
          return key;
        }
      }
      return val;
    },
    eq: (a, b) => a === b,
    and: (a, b) => a && b,
    or: (a, b) => a || b,
    year: () => 2026
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve Static Assets from src/public and fallback public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../public')));

// Parse form & json bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', routes);

// 404 Handler - redirect to home of default language
app.use((req, res) => {
  res.redirect('/az');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Snaker marketing site listening at http://localhost:${PORT}`);
  });
}

module.exports = app;
