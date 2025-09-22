const nsWebpack = require("@nativescript/webpack");
const webpack = require('webpack');

module.exports = (env) => {
	nsWebpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	const config = nsWebpack.resolveConfig();

	// Provide minimal fallbacks to avoid bundling errors from style tooling
	config.resolve = config.resolve || {};
	config.resolve.fallback = Object.assign({}, config.resolve.fallback, {
		path: require.resolve('path-browserify'),
		url: require.resolve('url/'),
		util: require.resolve('util/'),
		process: require.resolve('process/browser'),
		buffer: require.resolve('buffer/'),
		fs: false,
	});

	config.plugins = config.plugins || [];
	config.plugins.push(
		new webpack.ProvidePlugin({
			process: 'process/browser',
			Buffer: ['buffer', 'Buffer'],
		})
	);

	return config;
};
