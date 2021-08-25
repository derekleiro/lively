module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{json,html,js,css,txt,png,ogg,gif,woff2}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'build/sw.js'
};