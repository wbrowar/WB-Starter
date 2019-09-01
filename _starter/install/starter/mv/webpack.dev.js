// webpack plugins
const merge = require('webpack-merge');
// config files
const common = require('./webpack.common.js');

// Development module exports
module.exports = [
    merge(
        common.legacyConfig,
        {
            mode: 'development',
        }
    ),
    merge(
        common.modernConfig,
        {
            mode: 'development',
        }
    ),
];