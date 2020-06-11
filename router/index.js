const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const routes = fs.readdirSync(path.join(__dirname, 'routes'));

function wrapAsync(fn) {
	return function(req, res, next) {
		fn(req, res, next).catch(next); // 모든 오류를 .catch() 처리하고 체인의 next()에 전달.
	};
}

const setRouters = async () => {
	for (const route of routes) {
		const { method, url, func } = require(path.join(__dirname, 'routes', route))();
		router[method](url, wrapAsync(async function(...args) {
			await func(...args);
		})); // router.post(url, wrapAsync);
	}
};

module.exports = async () => {
	await setRouters();
	return router;
};