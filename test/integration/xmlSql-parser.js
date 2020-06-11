const chai = require("chai"); // 테스트 어설션 및 http 테스팅 제공
const tools = require("../tools");
const xmldoc = require('xmldoc');

// 테스트할 내용
describe("xmlToSql Test", () => {

	it("_getParamValue string and object key recognition", function (done) {
		// 테스트 구문에서 "userId", 'userId'는 단순 문자열로 인식하고, 
		// userId는 제시된 오브젝트의 키로인식하여 해당 값을 찾아 돌려주는지 테스트한다.
		let queryParamObject = {
			"userId": 123,
			"userName": 'jaepil'
		}

		let output = tools.xmlSqlParser._getParamValue(`"userId"`, queryParamObject);
		chai.expect(output).to.equal(`"userId"`);

		output = tools.xmlSqlParser._getParamValue(`'userId'`, queryParamObject);
		chai.expect(output).to.equal(`'userId'`);
		output = tools.xmlSqlParser._getParamValue(`userId`, queryParamObject);
		chai.expect(output).to.equal(123);
		
		return done();
	});

	it("_getParamValue array '[0]' test", function (done) {
		// 테스트 컨디션으로 배열을 찾을경우 올바른 값을 주는지 테스트한다.
		let queryParamObject = {
			"userId": 123,
			"userName": ['jaepil', 'kuenA']
		}

		let output = tools.xmlSqlParser._getParamValue(`userName[1]`, queryParamObject);
		chai.expect(output).to.equal(`'kuenA'`);

		return done();
	});

	it("_getParamValue have no value", function (done) {
		// 찾는값이 없는경우 undefined가 오는지 확인한다.
		let queryParamObject = {
			"userId": 123,
			"userName": ['jaepil', 'kuenA']
		}

		let output = tools.xmlSqlParser._getParamValue(`userAge`, queryParamObject);
		chai.expect(output).to.equal(undefined);

		return done();
	});

	it("_getParamValue, if result is object then empty check", function (done) {
		// 값이 오브젝트가 되면, 해당 오브젝트가 비었는지 여부를 체크해서 true/false로 되돌려준다.
		let queryParamObject = {
			"master": {name: 'jaepil', age:45},
			"guests": [{name: 'Kim', age:45}, {name: 'Lee', age:45}],
			"fakeObject": {},
			"fakeArray": []
			
		}

		let output = tools.xmlSqlParser._getParamValue(`master`, queryParamObject, true);
		chai.expect(output).to.equal(true);

		output = tools.xmlSqlParser._getParamValue(`guests`, queryParamObject, true);
		chai.expect(output).to.equal(true);

		output = tools.xmlSqlParser._getParamValue(`fakeObject`, queryParamObject, true);
		chai.expect(output).to.equal(false);

		output = tools.xmlSqlParser._getParamValue(`fakeArray`, queryParamObject, true);
		chai.expect(output).to.equal(false);

		return done();
	});

	it("_testCondition check", function (done) {
		// 자바스크립트 테스트를 수행했을때 동일한 true/false가 되돌아 와야 한다.
		let trueInput = `userId == 123 and userName == 'jaepil'`;
		let trueInput2 = `userId == '123' and userName == 'jaepil'`;
		let falseInput = `userId === '123' and userName == 'jaepil'`;
		let queryParamObject = {
			"userId": 123,
			"userName": 'jaepil'
		}

		let output1 = tools.xmlSqlParser._testCondition(trueInput, queryParamObject);
		chai.expect(output1).to.equal(true);

		let output2 = tools.xmlSqlParser._testCondition(trueInput2, queryParamObject);
		chai.expect(output2).to.equal(true);

		let output3 = tools.xmlSqlParser._testCondition(falseInput, queryParamObject);
		chai.expect(output3).to.equal(false);

		let output4 = tools.xmlSqlParser._testCondition(null, queryParamObject);
		chai.expect(output4).to.equal(null);

		return done();
	});

	it("queryParser test", function (done) {
		let file = tools.xmlFile;
		let sqlId = "getUserTest";
		let queryParamObject = {
			"user_id": 123,
			"userName": 'jaepil'
		}
		
		// async function test
		// https://stackoverflow.com/questions/41761683/why-am-i-getting-error-resolution-method-is-overspecified
		tools.xmlSqlParser
		.queryParser(file, sqlId, queryParamObject)
		.then(function(result) {
			chai.expect(result).to.equal('SELECT * FROM user\n\t\t\tWHERE user_id = :user_id');
			done();
		});
		
	});

	it("queryParser not found sqlId", function (done) {
		let file = tools.xmlFile;
		let sqlId = "something";
		let queryParamObject = {
			"user_id": 123,
			"userName": 'jaepil'
		}
		
		tools.xmlSqlParser
		.queryParser(file, sqlId, queryParamObject)
		.then(function(result) {
			chai.expect(result).to.equal('sqlId : [ something ] not found.');
			done();
		});
	});

	it("conditions test", function (done) {
		let file = tools.xmlFile;
		let sqlId = "getUser";
		let queryParamObject = {
			user_id: 1,
			user_name: 'xxx',
			company: {
				id: 'x',
				name: 'Tiang Wei'
			},
			pagination: {
				start: 1,
				end: 10
			},
			girl: {
				friends: [
					{ name: 'Song Hye Gyo', age: 38 , pan: [ {name: 'goo', age: 15}, {name: 'park', age: 25} ]},
					{ name: 'Seo Hyeon', age: 28, pan: [ {name: 'goo2', age: 19}, {name: 'park2', age: 25} ] },
					{ name: 'IU', age: 18, pan: [ {name: 'goo3', age: 16}, {name: 'park3', age: 25} ] },
					{ name: 'park', age: 48, pan: [ {name: 'goo4', age: 17}, {name: 'park4', age: 25} ] }
				]
			}
		}
		
		tools.xmlSqlParser
		.queryParser(file, sqlId, queryParamObject)
		.then(function(result) {
			chai.expect(result).to.equal(`SELECT * FROM user\n\t\t\tWHERE user_id = :user_id\n\t\t\t\tAND company_id = :company.id\n\t\t\t\tAND condition = \'type1\'\n\t\t\t\tAND girl.friends[0].age == 38\n\t\t\t\t \n\t\t\t\t\t AND user_name = :user_name\n\t\t\t\t \n\t\t\t\t\t \n\t\t\t\t\t AND company_type = \'xType\' \n\t\t\t\t\n\t\t\t\tAND (\'Song Hye Gyo\', \'goo\', iu age is 38,\'Seo Hyeon\', \'goo2\', iu age is 28,\'IU\', \'goo3\', iu age is 18,\'park\', \'goo4\', iu age is 48 )\n\n\t\t\t ORDER BY user_id ASC AND user_id = :user_id limit 1, 10 gropu by name!!!!`);
			done();
		});
	});
	

});
// nyc npm test
// nyc report --reporter=html