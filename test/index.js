global.chai = require('chai');
global.expect = global.chai.expect;

const UNIT = [
  './unit/index.js'
];

const INTEGRATION = [
  './integration/index.js'
];

switch (process.env.TEST_ENV) {
  case 'UNIT':
    UNIT.forEach(require);
    break;
  default:
    [...UNIT, ...INTEGRATION].forEach(require);
}