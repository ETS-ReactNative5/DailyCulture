const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const webpack = require('webpack');
const path = require('path');

module.exports = withPlugins([[withImages]], {
  webpack(config, options) {
    config.resolve.modules.push(path.resolve('./'));
    return config;
  },
  images: {
    domains: [
      'square-catalog-sandbox.s3.amazonaws.com',
      'square-catalog-production.s3.amazonaws.com',
      'items-images-production.s3.us-west-2.amazonaws.com',
    ],
  },
});
