const paths = require('./paths');

module.exports = [
  `${paths.src}/**/*.md`,
  `${paths.src}/**/_*.scss`,
  `${paths.src}/**/style/**/*.scss`,
  `${paths.src}/template/**/*.scss`,
  `${paths.src}/include/**/*.scss`,
  `${paths.src}/packages/*/template/**/*.scss`,
  `${paths.src}/packages/*/include/**/*.scss`,
];
