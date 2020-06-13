### Run
```
npm i
node server.js
[http](http://localhost:3000/fetch?id=12345)
```

### Test
```
nyc npm test
nyc report --reporter=html
coverage/index.html
```

### Summary
```
mocha : 단위 테스트 라이브러리
chai : 어서션 제공 라이브러리
chai-http : http 제공
nyc : 테스트 커버리지 확인 돕는 라이브러리
mysql2 : DB connector (namedPlaceholders: true 설정 필수)
xmldoc_2.2.3.js : (자작유틸) myBatis 처럼 xml 파일속 sql문을 test 구문에 파라미터를 대입하여 파싱.
xmldoc : xml 파싱 라이브러리
dotenv : .env 파일의 내용(민감정보)를 process.env에 옮겨주는 라이브러리. (주의! .env 파일은 절대 깃으로 공유하지 않습니다.)
.env 파일이 필요함 : 루트 경로 .env 파일안에는 다음과 같은 형태의 정보가 추가되어 있어야 합니다.
DEV_DB_HOST = '127.0.0.1'
DEV_DB_PORT = 3306
DEV_DB_NAME = 'xxxx'
DEV_DB_USER = 'yyyy'
DEV_DB_PASS = 'zzzz'
```

### Database
```
CREATE TABLE `user` (
	`user_id` INT(11) NULL DEFAULT NULL,
	`user_name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci'
)
COMMENT='test'
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
```
