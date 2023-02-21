/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
	dest: "public",
});

const nextConfig = {
	reactStrictMode: true,
	webpack(config, options) {
		config.module.rules.push({
			test: /\.(mp3)$/,
			type: "asset/resource",
			generator: {
				filename: "static/chunks/[path][name].[hash][ext]",
			},
		});

		return config;
	},
	async rewrites() {
		return [
			{
				source: "/bee.js",
				destination: "https://cdn.splitbee.io/sb.js",
			},
			{
				source: "/_hive/:slug",
				destination: "https://hive.splitbee.io/:slug",
			},
		];
	},
};

module.exports = withPWA(nextConfig);

