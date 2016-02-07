global.chai = require('chai');
global.expect = global.chai.expect;

const UNIT = [
  './unit/grammars/extract-series.spec.js',
  './unit/grammars/extract-episode-links.spec.js'
];

const INTEGRATION = [
  './realworld/grammars/extract-episode-links.spec.js'
];

switch (process.env.TEST_ENV) {
  case 'UNIT':
    UNIT.forEach(require);
    break;
  default:
    [...UNIT, ...INTEGRATION].forEach(require);
}