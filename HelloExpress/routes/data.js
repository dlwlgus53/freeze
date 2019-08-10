var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var obj = {};
var tid;
//var db_config = require('./db_config.json');


var connection = mysql.createConnection({
  user: "root",
  password: "sodlfma53",
  database: "fff",
  multipleStatements: true,
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('data');
});

/*시간수정 페이지*/
router.get('/time', function(req, res, next) {

  sql = 
    // [0] column 1 - 현재까지 저장된 시간
    "SELECT * FROM fff.times";

    connection.query(sql, function(err, query, fields){
      

      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
        console.log(query);
        obj = 
        {
          data: query
        };
        res.render('data/time',obj)
      }
    });
});

/*시간 추가*/
router.post('/time/addtime', function(req, res, next) {
  var name = req.body.name;
  var comment = req.body.comment;
  connection.query("INSERT INTO times ( timename, timecomment) VALUES (?,?)", [
    name, comment
  ], function(err, result) {
    if (err) {
      console.log("add에 에러");
      console.log(err);
    }else{
      res.redirect('/data/time');
    }
    
  });
  
});

/*시간 삭제*/
router.post('/time/deletetime', function(req, res, next) {
  console.log(req.body);
  var tid= req.param("timeid");
  console.log(tid);
  connection.query("DELETE FROM times WHERE timeid="+String(tid)+";",
  function(err, result) {
    if (err) {
      console.log("delete alarm에 에러");
      console.log(err);
    }else{
      console.log(result);
      res.redirect('/data/time');
    }
  });
  
});


/* 팀 관리 페이지*/
router.get('/team', function(req, res, next) {
  sql = 
    // [0] column 1 - 현재까지 저장된 시간
    "SELECT * FROM fff.team LEFT JOIN fff.times ON fff.team.timeid = fff.times.timeid";
    connection.query(sql, function(err, query, fields){
      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
        obj = 
        {
          data: query
        };
        res.render('data/team',obj)
      }
    });
});

/* 팀 수정 페이지*/
router.get('/teammake', function(req, res, next) {
  tid= req.param("tid");
 
    sql = 
    "SELECT * FROM fff.user_; "
     + "SELECT * FROM fff.team where id =" + tid + ";"
     + "SELECT userid FROM fff.user_team where teamid =" + tid + ";";

    connection.query(sql, function(err, query, fields){
      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
       console.log(query)
        obj = 
        {
          user: query[0],
          team : query[1],
          user_t : query[2]
        };
        
        res.render('data/teammake',obj)
      }
    });


  

});

/* 팀 수정 페이지. 팀원 추가*/
router.post('/teammake/addteam', function(req, res, next) {
  console.log(req.body);
  var uid = req.param("uid");
    sql = "delete from user_team where teamid ="+ tid + ";";
    var i=0;
    uid.forEach(function(uid) {
      sql += "insert into user_team (userid, teamid) values(" + uid + ", "+tid+");";
      
  });
    connection.query(sql, function(err, query, fields){
      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
        console.log(query);
        res.redirect('/data/team');
      }
    });  
});


/* 스케쥴 관리 페이지*/
router.get('/schedule', function(req, res, next) {
  sql = 
    // [0] team
    "SELECT * FROM fff.team;" +
    // [1]user_Team
    "SELECT * FROM fff.user_team JOIN fff.user_ on user_team.userid = user_.user_id;" + 
    // [2]user+team+time
    "SELECT *FROM  fff.times  as times  \
    JOIN fff.team as team \
    ON fff.times.timeid = fff.team.timeid \
    JOIN fff.user_team as ut on  ut.teamid = id;" +
    // [3] time
    "SELECT * FROM fff.times;";

    connection.query(sql, function(err, query, fields){
      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
        console.log(query)
        obj = 
        {
          team: query[0],
          team_user : query[1],
          team_user_time : query[2],
          time : query[3]
        };
        res.render('data/schedule',obj);
      }
    });

});


/* 스케쥴 페이지 업데이트 */
router.post('/schedule/update', function(req, res, next) {
  console.log(req.body);
  // var uid = req.param("uid");
  //   sql = "delete from user_team where teamid ="+ tid + ";";
  //   var i=0;
  //   uid.forEach(function(uid) {
  //     sql += "insert into user_team (userid, teamid) values(" + uid + ", "+tid+");";
      
  // });
  //   connection.query(sql, function(err, query, fields){
  //     if (err){
  //       console.log("쿼리문에 오류가 있습니다.");
  //       console.log(err);
  //     }else{
  //       console.log(query);
  //       res.redirect('/data/team');
  //     }
  //   });  
});


module.exports = router;
