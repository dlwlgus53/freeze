var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const XLSX = require("xlsx");

var obj = {};
var tid;
//var db_config = require('./db_config.json');


var connection = mysql.createConnection({
  user: "root",
  password: "sodlfma53",
  database: "fff",
  multipleStatements: true,
})



module.exports = router;


/* GET main page. */
router.get('/', function(req, res, next) {
  res.render('data');
});

/* GET data update  */
router.get('/update', function(req, res, next) {
  sql = "SELECT * FROM user_;"+
        "SELECT * FROM team_;"
  connection.query(sql, function(err, query, fields){
    if (err){
      console.log("쿼리문에 오류가 있습니다.");
      console.log(err);
    }else{
      obj = 
        {
          user : query[0],
          team : query[1]

        };
      res.render('data/update',obj);
      }
  });
});


/* update user button*/
router.get("/update/user", function(req,res,next){
  let workbook = XLSX.readFile(__dirname + "/../public/user.xlsx")
  let worksheet = workbook.Sheets["Sheet1"]

  //console.log(worksheet)
  let datas = [];
  // 행의갯수만큼 반복 , 열의갯수만큼 알파벳추가
  var i;
  for(i = 1;; i++){
    if(worksheet["A" + i] == undefined){
      console.log(i)
      break;
    }
    let obj = {
      id: worksheet["A" + i].w,
      name: worksheet["B" + i].w,
    }
   
    datas.push(obj);
  }
  console.log(datas);
 

  //mysql에 업데이트하기
  //일단 전부 삭제
  sql = "DELETE FROM user_;";
  //하나씩 추가하기

  var len = i-1;
  console.log(len)
  if(len==1){
    sql += "insert into user_ (user_id, name) values('" +datas.id + "', '"+datas.name+"');";
  }else if(len>1){
    datas.forEach(function(datas) {
      sql += "insert into user_ (user_id, name) values('" + datas.id + "', '"+datas.name+"');";
    });
  }

  connection.query(sql, function(err, query, fields){
    if (err){
      console.log("쿼리문에 오류가 있습니다.");
      console.log(err);
    }else{
      res.redirect('/data/update');
    }
  });
})

/* update team button*/
router.get("/update/team", function(req,res,next){
  let workbook = XLSX.readFile(__dirname + "/../public/team.xlsx")
  let worksheet = workbook.Sheets["Sheet1"]

  //console.log(worksheet)
  let datas = [];
  // 행의갯수만큼 반복 , 열의갯수만큼 알파벳추가
  // name_ in public
  var i;
  for(i = 1;; i++){
    if(worksheet["A" + i] == undefined){
      console.log(i)
      break;
    }
    let obj = {
      id: worksheet["A" + i].w,
      teamname: worksheet["B" + i].w,
    }
   
    datas.push(obj);
  }
  console.log(datas);
 

  //mysql에 업데이트하기
  //일단 전부 삭제
  sql = "DELETE FROM team_;" + 
        "DELETE FROM team_time;"+
        "DELETE FROM user_team;";

  //하나씩 추가하기

  var len = i-1;
  console.log(len)
  if(len==1){
    sql += "insert into team_ (teamid, teamname) values('" +datas.id + "', '"+datas.teamname+"');";
  }else if(len>1){
    datas.forEach(function(datas) {
      sql += "insert into team_ (teamid, teamname) values('" +datas.id + "', '"+datas.teamname+"');";
    });
  }

  connection.query(sql, function(err, query, fields){
    if (err){
      console.log("쿼리문에 오류가 있습니다.");
      console.log(err);
    }else{
      res.redirect('/data/update');
    }
  });
})

/*시간수정 페이지*/
router.get('/time', function(req, res, next) {

  sql = 
    // [0] column 1 - 현재까지 저장된 시간
    "SELECT * FROM fff.time_";

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
  connection.query("INSERT INTO time_ ( timename, timecomment) VALUES (?,?)", [
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
  connection.query("DELETE FROM time_ WHERE timeid="+String(tid)+";",
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
    "SELECT * FROM team_;"; 
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
     + "SELECT * FROM fff.team_ where teamid =" + tid + ";"
     + "SELECT userid FROM fff.user_team where teamid =" + tid + ";";

    connection.query(sql, function(err, query, fields){
      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
      //  console.log(query)
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
  var uidlen = 0;
  if(uid == undefined){//0명의 팀원 저장
    uidlen = 0;
  }else if(typeof(uid) == String){//1명의 팀원 저장
    uidlen = 1;
  }else{//n명의 팀원 저장
    uidlen = uid.length;
  }
    sql = "delete from user_team where teamid ="+ tid + ";";

  if(uidlen==1){
    sql += "insert into user_team (userid, teamid) values(" + uid + ", "+tid+");";
  }else if(uidlen>1){
    uid.forEach(function(uid) {
      sql += "insert into user_team (userid, teamid) values(" + uid + ", "+tid+");";
    });
  }

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
    "SELECT b.teamid, b.teamname, timeid, teamcomment\
     FROM fff.team_  b LEFT JOIN fff.team_time a \
      on a.teamid = b.teamid;"+
    // [1]user_Team
    "SELECT * FROM fff.user_team JOIN fff.user_ on user_team.userid = user_.user_id;" + 
    // [2]user+team+time
    "SELECT * FROM\
      (SELECT timeid, timename, timecomment, ttt.teamid, teamname, id, userid FROM\
        (SELECT t.timeid, timename, timecomment, tt.teamid, teamname\
          FROM  fff.time_ AS  t\
          JOIN fff.team_time AS  tt\
          on tt.timeid = t.timeid\
        ) AS ttt\
        LEFT JOIN fff.user_team AS ut\
        on  ut.teamid = ttt.teamid \
      ) AS u\
    JOIN user_ on u.userid = user_.user_id;"+
    // [3] time
    "SELECT * FROM fff.time_;"+
    // [4] team_
    "SELECT * FROM fff.team_;";

    connection.query(sql, function(err, query, fields){
      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
         //console.log(query)
        obj = 
        {
          team: query[0],
          team_user : query[1],
          team_user_time : query[2],
          time : query[3],
          team_ : query[4]
        };
        res.render('data/schedule',obj);
      }
    });

});


/* 스케쥴 페이지 업데이트 */
router.post('/schedule/update', function(req, res, next) {
  //var timeid = req.body;
  var timeid = req.param("timeid");
  var teamname = req.param("teamname");
  var teamid = req.param("teamid");
  var timelen = 0;
  if(timeid == undefined){
    timelen = 0;
  }else if(typeof(timeid) == String){//n개
    timelen = 1;
  }else{
    timelen = timeid.length;
  }
  sql = "delete from team_time where teamid ='"+ teamid + "';";//현재 저장되어있는 시간 전체 삭제
  var i=0;
  if(timelen >1){
    timeid.forEach(function(timeid) {
      sql += "insert into team_time (teamid, teamname, timeid) values('"+teamid+"','" + teamname + "', "+timeid+");";
    });
  }else if(timelen==1){
    sql += "insert into team_time (teamid, teamname, timeid) values('"+teamid+"','" + teamname + "', "+timeid+");";
  }
  
    connection.query(sql, function(err, query, fields){
      if (err){
        console.log("쿼리문에 오류가 있습니다.");
        console.log(err);
      }else{
        console.log(query);
        res.redirect('/data/schedule');
      }
    });  
});


module.exports = router;
