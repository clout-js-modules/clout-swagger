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

			if (!conf || conf.enabled !== true) {
				this.logger.info('clout-swagger is disabled');
				return next();
			}

			if (!this.core.api) {
				this.logger.error('clout-swagger is not supported by this version of clout-js');
				return next();
			}

			let routes = this.core.api.routes;

			conf = _.merge({
				swagger: '2.0',
				info: {
					description: this.applicationPackage.description,
					version: this.applicationPackage.version,
					title: this.applicationPackage.name,
				},
				host: os.host,
				schemes: Object.keys(this.server)
			}, conf);

			let openapi = _.omit(conf, ['enabled', 'basePath']);
			openapi.paths = {};

			Object.keys(routes).forEach((group) => {
				routes[group].forEach((endpointMeta) => {
					if (!openapi.paths[endpointMeta.path]) {
						openapi.paths[endpointMeta.path] = {};
					}

					endpointMeta.methods.forEach((method) => {
						openapi.paths[`/api${endpointMeta.path}`][method] = {
							description: endpointMeta.description,
							tags: [endpointMeta.group]
						};
					});
				});
			});

			this.app.get(`${conf.basePath}/openapi.json`, (req, resp) => {
				resp.json(openapi);
			});

			this.app.get(conf.basePath, (req, resp) => {
				resp.render('apidocs.ejs', {
					config: conf
				});
			});
			this.app.use(conf.basePath, express.static(swaggerUiAssetPath));

			this.logger.info('clout-swagger initialized');
			next();
		}
	}
};
