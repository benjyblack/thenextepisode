global.chai = require('chai');
global.expect = global.chai.expect;

// stub out document
require('./content-scripts/extract-series.spec.js');