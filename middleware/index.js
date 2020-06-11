const path = require('path');
const defaultMiddlewares = [
	'static',
	'bodyParser'
];

module.exports = (app) => {
	for (const middleware of defaultMiddlewares) {
		app.use(require(path.join(__dirname, 'middlewares', `${middleware}.js`)))
	}
};
