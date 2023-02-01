const postcssNested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');

const config = {
	plugins: [
		postcssNested(),
		postcssPresetEnv({
			stage: 2,
		})
	]
};

module.exports = config;
