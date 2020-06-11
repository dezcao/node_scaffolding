const chai = require("chai"); // 테스트 어설션 및 http 테스팅 제공
const http = require("chai-http"); // npm i chai-http 
const tools = require("../tools");
chai.use(http);

// 테스트할 내용
describe("xmlToSql Test", () => {
	
	it("/fetch test id 12345", function (done) {
		chai
		.request(tools.server)
		.get("/fetch?id=123456")
		.end((err, res) => {
			chai.expect(res).to.have.status(200);
			// res.body 안에 내가 실어보낸 값의 형태대로 들어있음에 주의한다.
			chai.expect(res.body.result[0]).to.have.property("user_id", 1);
			return done();
		});

		// chai
		// .request(tools.service)
		// .post("/uploads/test_image_check.png")
		// .set("Content-Type", "image/png")
		// .send(tools.sample)
		// .end((err, res) => {
		// 	chai.expect(res).to.have.status(200);
		// 	chai.expect(res.body).to.have.status("ok");

		// 	chai
		// 	.request(tools.service)
		// 	.head("/uploads/test_image_check.png")
		// 	.set("Content-Type", "image/png")
		// 	.send(tools.sample)
		// 	.end((err, res) => {
		// 		chai.expect(res).to.have.status(200);
		// 		return done();
		// 	});
		// });
		
	});
	

});