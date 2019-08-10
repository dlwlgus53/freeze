var express = require('express');
var router = express.Router();
const mysql = require("mysql");   // mysql 모듈 require

// 커넥션 연결
let client = mysql.createConnection({
  user: "root",
  password: "sodlfma53",
  database: "fff"
})

module.exports = router;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Freeze 관리자모드' });
});

module.exports = router;
