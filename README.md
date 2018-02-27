clout-swagger
==================
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
        path: '/docs'
    }
};
```

## Usage
The documentation will be derived by your clout-api's
