const { check, validationResult } = require('express-validator'); // npm install --save express-validator
const pool = require('../database/pool');
const fs = require('fs');
const path = require('path');
let xmldoc = require('../database/xmldoc_2.2.3.js');

module.exports = async (req, response) => {
    // 익스프레스 라우터는 전달받은 콜백에 리퀘스트, 리스폰스를 자동으로 삽입한다.
    // 또한, 리퀘스트에는 익스프레스의 app이 이미 들어있다.
    
    // validation : express-validator 활용함.
    await check('id').isLength({ min: 5 }).withMessage('Too short').run(req);
    let result = validationResult(req);
    // console.log(result.errors[0]);
    // throw new Error('my error!!!');
    try {
        // model, sql
        var xmlFileString = fs.readFileSync(path.join(__dirname, '../database/sql', 'user.xml'), 'utf8');
        var sqlId = 'getUserTest';
        var queryParam = {user_id: 1};
        let query = await xmldoc.queryParser(xmlFileString, sqlId, queryParam);
        const [rows,fields] = await pool.query(query, queryParam);
        console.log(rows);
        response.json({"result": rows});
        // return res.json({"result": rows});
        
        // usage. Transaction
        // await pool.query('START TRANSACTION');
        // query = 'insert into user (user_id, user_name) values (?, ?)';
        // queryParam = [2, "qfwe"];
        // const [rows,fields] = await pool.query(query, queryParam);
        // console.log(rows);
        // await pool.query('COMMIT');
        
    } catch (error) {
        console.error(error);
        await pool.query('ROLLBACK');
        response.json({"error": error});
    }
};
