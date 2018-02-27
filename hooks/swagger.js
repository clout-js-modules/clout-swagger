/*!
 * clout-swagger
 * Copyright(c) 2015 - 2016 Muhammad Dadu
 * MIT Licensed
 */
const os = require('os');
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath()
const _ = require('lodash');
const express = require('express');

module.exports = {
	docgen: {
		event: 'start',
		priority: 'CONTROLLER',
		fn: function (next) {
			let conf = this.config.swagger;
			let apiLayers = this.app._router.stack;

			if (!conf || conf.enabled !== true) {
				this.logger.info('clout-swagger is disabled');
				return next();
			}

			if (!this.apiRoutes) {
				this.logger.error('clout-swagger is not supported by this version of clout-js');
				return next();
			}

			conf = _.merge({
				swagger: '2.0',
				info: {
					description: this.package.description,
					version: this.package.version,
					title: this.package.name,
				},
				host: os.host,
				schemes: Object.keys(this.server)
			}, conf);

			let openapi = _.omit(conf, ['enabled']);
			openapi.paths = {};

			Object.keys(this.apiRoutes).forEach((group) => {
				this.apiRoutes[group].forEach((endpointMeta) => {
					if (!openapi.paths[endpointMeta.path]) {
						openapi.paths[endpointMeta.path] = {};
					}

					endpointMeta.methods.forEach((method) => {
						openapi.paths[endpointMeta.path][method] = {
							description: endpointMeta.description
						};
					});
				});
			});

			this.app.get(`${conf.basePath}/openapi.json`, (req, resp) => {
				resp.json(openapi);
			});

			this.app.get(conf.basePath, (req, resp) => {
				resp.render('apidocs.ejs');
			});
			this.app.use(conf.basePath, express.static(swaggerUiAssetPath));

			this.logger.info('clout-swagger initialized');
			next();
		}
	}
};
