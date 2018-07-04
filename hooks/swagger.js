/*!
 * clout-swagger
 * Copyright(c) 2015 - 2016 Muhammad Dadu
 * MIT Licensed
 */
const os = require('os');
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath()
const _ = require('lodash');
const express = require('express');

const EXPRESS_PATH_PARAM_REGEX = /:([a-zA-Z_0-9]+)\/?/gi;

function getParamsInPath(path) {
	let match;
	let params = [];

	while (match = EXPRESS_PATH_PARAM_REGEX.exec(path)) {
		if (match) {
			params.push(match[1]);
		}
	}

	return params
}

function generateOpenApiPath(_path) {
	let path = _path;
	let params = getParamsInPath(path);

	params.forEach((key) => path = path.replace(`:${key}`, `{${key}}`));

	return path;
}

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
					const metaParams = endpointMeta.params || {};
					const openApiPath = generateOpenApiPath(`/api${endpointMeta.path}`);
					const pathParams = getParamsInPath(endpointMeta.path);
					let parameters = [];

					if (!openapi.paths[openApiPath]) {
						openapi.paths[openApiPath] = {};
					}

					// add path params to openApi
					parameters = parameters.concat(pathParams.map((name) => {
						let openApiParam = {
							name: name,
							in: 'path',
							required: endpointMeta.path.indexOf(`:${name}?`) !== -1
						};
						let meta = metaParams[name] || {};

						if (typeof meta === 'object' && ['body', 'query', 'path'].indexOf(meta.in) !== -1) {
							Object.assign(openApiParam, meta);
						}

						return openApiParam;
					}));

					// add api defined params to openApi
					parameters = parameters.concat(Object.keys(metaParams).filter((name) => pathParams.indexOf(name) === -1).map((name) => {
						let openApiParam = {
							name: name
						};
						let meta = metaParams[name] || {};

						if (typeof meta === 'object' && ['body', 'query', 'path'].indexOf(meta.in) !== -1) {
							Object.assign(openApiParam, meta);
						}

						return openApiParam;
					}));

					endpointMeta.methods.forEach((method) => {
						openapi.paths[openApiPath][method] = {
							description: endpointMeta.description,
							tags: [endpointMeta.group],
							parameters
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
