global.chai = require('chai');
global.expect = global.chai.expect;

const UNIT = [
  './unit/grammars/series-page.spec.js',
  './unit/grammars/versions-page.spec.js'
];

const INTEGRATION = [
  './realworld/grammars/versions-page.spec.js'
];

switch (process.env.TEST_ENV) {
  case 'UNIT':
    UNIT.forEach(require);
    break;
  default:
    [...UNIT, ...INTEGRATION].forEach(require);
}