const webpack = require('webpack');
module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
    process: require.resolve('process/browser'),
    util: require.resolve('util'),
    vm: false,
    fs: false,
    net: false,
    tls: false,
  });
  config.resolve.fallback = fallback;

  // webpack 5에서 process/browser 문제 해결
  config.resolve.alias = {
    ...config.resolve.alias,
    process: require.resolve('process/browser'),
  };

  // webpack 5에서 Node.js polyfills 설정
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  // 소스맵 경고 무시 설정
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /ENOENT: no such file or directory/,
  ];

  return config;
};
