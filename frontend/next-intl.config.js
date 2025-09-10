const {defineConfig} = require('next-intl/config');

module.exports = defineConfig({
  locales: ['en', 'fr'],
  defaultLocale: 'en'
});
