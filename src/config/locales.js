/**
 * Scalable Locale Configuration
 * Extensible for adding new languages in the future
 */

const supportedLocales = [
  { code: 'az', label: 'AZ', name: 'Azərbaycan' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'tr', label: 'TR', name: 'Türkçe' }
];

const defaultLocale = 'az';

const getLocaleCodes = () => supportedLocales.map(l => l.code);

const isSupported = (code) => getLocaleCodes().includes(code);

module.exports = {
  supportedLocales,
  defaultLocale,
  getLocaleCodes,
  isSupported
};
