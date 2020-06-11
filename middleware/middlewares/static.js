const express = require('express');
// https://expressjs.com/ko/starter/static-files.html
// 이미지, CSS 파일 및 JavaScript 파일과 같은 정적 파일을 제공하는 Express의 기본 제공 미들웨어 함수
module.exports = express.static('views');
