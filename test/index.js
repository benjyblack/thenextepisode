global.chai = require('chai');
global.expect = global.chai.expect;

require('./grammars/extract-series.spec.js');
require('./grammars/extract-episode-links.spec.js');