const fs = require('fs');
const path = require('path');
const mocha = require('mocha'); // 단위 테스트 라라이브러리
const suite = new mocha();

// 모든파일 추가
fs.readdir(path.join(__dirname, "integration"), (err, files) => {
	if (err) throw err;

	files.filter((filename) =>(filename.match(/\.js$/)))
		.map((filename) => {
			suite.addFile(path.join(__dirname, "integration", filename));
	});
	

	suite.run((failures) => {
		process.exit(failures);
	});
});

// npm i mocha
// npm i chai
// 이 테스트 파일을 npm에 알려주기 위해 scripts 아래의 test 항목으로 node test/run을 추가해주는게 좋겠다.

// *** 코드 커버리지 ***
// 코드 커버리지는 개발 시작 단계에선 추가하기 쉽지만, 완전히 작동하는 코드에 하기는 어렵다.
// 다음은 코드 커버리지를 위해 추가할 모듈이다.
// npm i -g nyc
// 설치가 완료되면 이제 테스트 수행 명령을 다음과 같이 입력한다.
// nyc npm test
// .nyc_ouput 폴더에서 최근 테스트 결과를 볼 수 있다. (테스트를 다시 실행하지 않아도 된다.)
// 이것은 테스트가 크고, 실행 시간이 많이 걸릴때 유용하다. 결과를 보려면 nyc report
// nyc report --reporter=html 을 사용하면 coverage 폴더에 index.html이 생성된다. 이 파일을 브라우저로 확인가능하다.
// 브라우저로 보면 다음 항목이 있을거다. Statements(코드문), Branches(분기), Function(함수)
// 파일명을 클릭하면 자세한 정보를 볼 수 있다.
// 테스트는 일정한 코드 품질을 달성하도록 도와준다.
