/*!
 * clout-swagger
 * Copyright(c) 2015 - 2016 Muhammad Dadu
 * MIT Licensed
 */
module.exports = {
	swagger: {
		enabled: true,
		basePath: '/docs',
		info: {
			termsOfService: '<url-here>',
			contact: {
				email: 'youremail@org.tld'
			},
			license: {
				name: 'Apache 2.0',
				url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
			},
		},
		tags: [
			{
				name: 'clout',
				description: 'clout-js docs',
				externalDocs: {
					description: 'find out more',
					url: 'http://docs.clout.tech'
				}
			}
		]
	}
};
