// 모든 테스트 파일이 사용할 공통작업.
const fs = require('fs');
const path = require('path');

// exports.CustomError = require('../CustomError.js'); // 에러
exports.server = require('../server.js'); // 검증할 서비스 로직
exports.xmlSqlParser = require('../database/xmldoc_2.2.3.js'); // sql 파서
exports.xmlFile = fs.readFileSync(path.join(__dirname, 'user.xml'), 'utf8'); // 파싱 샘플용 xml
