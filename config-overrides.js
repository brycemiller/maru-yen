/* config-overrides.js */
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const webpack = require('webpack');

module.exports = function override(config, env) {
    // Polyfills
    config.resolve.fallback = {
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
    };
    config.resolve.alias = {
      process: "process/browser",
    };

    // Allow imports outside of src
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
};
