# clout-swagger

> API documentation generation using the OpenAPI Specification

## Install

In the directory of your clout-js application, do the following;

1) Install this package

    ```bash
    npm install clout-swagger --save
    ```

2) Add this module to ```package.json```

    ```JSON
    {
        ...
        "modules": ["clout-swagger"]
        ...
    }
    ```

## Configure

Create a new file ```swagger.default.js``` or ```swagger.<YOUR_ENV>.js``` in ```/conf``` directory with the following JavaScript.

```JavaScript
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

```

## Usage

The documentation will be derived by your clout-api's
