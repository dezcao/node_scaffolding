const path = require('path');
const express = require('express');
const app = express();
const middleware = require('./middleware/index.js');
const getRouter = require('./router/index.js');
const server = () => {
	app.use(function(error, req, res, next) {
		// wrapAsync() 때문에 호출될 것입니다. (businessLogicLayer 처리중 에러 유발시키면 여기서 잡힌다.)
		// http://jeonghwan-kim.github.io/node/2017/08/17/express-error-handling.html
		res.json({ message: error.message });
	});

	app.listen(3000, () => {
		console.log('Server started');
	});
};
const initiate = async () => {
	app.use(await getRouter());
	// app.set('views', path.join(__dirname, 'views')); // 서버사이드 렌더링이 필요한 경우.
	// app.set('view engine', 'ejs'); // 서버사이르 렌더링 엔진. nuxt 활용하고 싶다.
};

// require('dotenv').config(); // 테스트에서 풀의 정보세팅이 용이하지 않아 pool.js에서 수행했지만 다른 방안도 생각해볼것.
middleware(app);

initiate().then(() => {
	server(); // server start
}).catch(err => {
	console.log('initiate error ::: ', err);
});
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app; // mocha 테스트를 위해서 내보냄.