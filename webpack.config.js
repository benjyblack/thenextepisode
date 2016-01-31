var path = require('path');

module.exports = {
  entry: {
    background: './js/background/index.js',
    content: './js/content-scripts/index.js',
    popup: './js/popup/popup.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /jquery\.js$/, loader: 'expose?$' },
      { test: /jquery\.js$/, loader: 'expose?jQuery' }
    ]
  }
};