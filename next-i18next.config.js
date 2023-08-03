const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es', 'ja'],
  },
  localePath: path.resolve('./public/locales'),
}