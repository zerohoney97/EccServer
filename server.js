const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const axios = require("axios");
const getLastDate = require("./getLastDate");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();

let bookFloorList,
  computerProgramList,
  daisyList,
  digitalBookList,
  hanofficeList,
  internetList,
  ocrList,
  screenReaderList,
  smartPhoneList;
let base, engBraille, hangeul, symbol, touch;
let connetToZeroHoneyMongoDb = process.env.DB_URL;

// 맥을 실험한다
MongoClient.connect(connetToZeroHoneyMongoDb, function (err, client) {
  //  "proxy": "http://localhost:8080"

  // node.js
  // 전역변수
  var dbAccount = client.db("Account");
  var dbStudent = client.db("Student");
  var dbEccList = client.db("EccList");
  var dbEccEvaluationData = client.db("EccEvaluationData");
  // 각 폼을 불러와주는 쿼리값
  // 리스트를 임시보관할 array
  var tempList;

  // 컬렉션 이름 바꾸는 메소드
  // MongoClient.connect('mongodb+srv://ecoco97:e911291!e9@eccproject.7wg6l.mongodb.net/EccSubtech?retryWrites=true&w=majority',function (err,client){
  //     db=client.db('EccSubtech');
  //     db.collection('form_daisy').rename('form/0/2');

  //     })

  // express 미들웨어 관리

  // .urlencoded()은 x-www-form-urlencoded형태의 데이터를
  // .json()은 JSON형태의 데이터를 해석

  // json 파일을 qs모듈로 사용
  app.use(express.urlencoded({ extended: true }));
  // json 파일을 qs모듈로 사용

  // json 파일 해석
  app.use(express.json());
  // json 파일 해석

  // express 미들웨어 관리

  http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
  });
  app.listen(process.env.PORT, (req, res) => {
    console.log("성공했구나 이녀석..");
  });

  // var server=http.createServer(app).listen(8080,function(req,res){

  //     console.log('또 성공했구나..이녀석');
  // })

  // https.createServer(options,app).listen(443,function(){
  //     console.log('또 또 성공했구나..이녀석');
  // })

  // 1.백엔드 2.프론트엔드 3.미들웨어

  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "build")));

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
  });
  app.get("/", function (요청, 응답) {
    응답.sendFile(__dirname + "/index.html");
  });

  // google-site-verification=uR1kEOUbJS60DOSd7pJM70Gpx8YqKfY-jjPk1oY_QUk
  // 파이어베이스 테스트용
  app.post("/testFire", (req, res) => {
    database
      .ref("ECC")
      .once("보조공학")
      .then(function (snapshot) {});
  });

  //  ECC list불러오는 함수
  app.get("/getEccList", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    let getEccList;
    var EccList = dbEccList.collection("List");
    const { data } = req.query;
    const dataArray = data.split("/");
    EccList.find().toArray((err, result) => {
      const bigCategory = dataArray[0];
      const smallCategory = dataArray[1];

      if (bigCategory === "보조공학") {
        getEccList = result[0][bigCategory][smallCategory];
        res.send(getEccList);
      } else if (bigCategory === "점자") {
        getEccList = result[1][bigCategory][smallCategory];
        res.send(getEccList);
      } else if (bigCategory === "보행") {
        getEccList = result[2][bigCategory][smallCategory];
        res.send(getEccList);
      } else {
        getEccList = result[3][bigCategory][smallCategory];
        res.send(getEccList);
      }
    });
  });

  app.get("/getStudentListFromDB", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    dbStudent
      .collection("A")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  });

  // 일반 선생님의 정보 불러오기
  app.get("/getTeacher", function (req, res) {
    dbAccount
      .collection("User")
      .find()
      .toArray((err, result) => {
        res.send(result);
      });
  });
  // 이름,생년월일로 특정선생님의 이메일을 찾는 매소드
  app.get("/getTeacherEmail", function (req, res) {
    const { name, birth } = req.query;
    dbAccount
      .collection("User")
      .findOne({ name: name, birth: birth }, function (err, result) {
        res.send(result.email);
      });
  });
  // 로그인한 선생님의 정보 불러오기
  app.get("/getTeacherInformation", function (req, res) {
    const { uid } = req.query;
    dbAccount.collection("User").findOne({ uid: uid }, (err, result) => {
      res.send(result);
    });
  });

  // 로그인한 선생님의 정보 불러오기

  // 선생님들이 관리하는 학생들 명단 불러오기
  app.get("/getStudentInformationByTeacher", function (req, res) {
    const { data } = req.query;

    dbStudent
      .collection("A")
      .find({ uid: data })
      .toArray((err, result) => {
        res.send(result);
      });
  });
  // 선생님들이 관리하는 학생들 명단 불러오기

  // 학생의 ECC평가 정보를 가져오는 함수

  // 사전평가 정보 불러오는 함수
  app.get("/getStudentPreEvaluationData", function (req, res) {
    let { uid } = req.query.studentData;
    dbEccEvaluationData
      .collection("PreTest")
      .find({ uid: uid })
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
  });
  // 사전평가 정보 불러오는 함수

  // 사후평가 정보 불러오는 함수
  app.get("/getStudentPostEvaluationData", function (req, res) {
    let { uid } = req.query.studentData;
    dbEccEvaluationData
      .collection("PostTest")
      .find({ uid: uid })
      .toArray(function (err, result) {
        if (err) throw err;

        res.send(result);
      });
  });

  // 사후평가 정보 불러오는 함수

  // 학생의 ECC평가 정보를 가져오는 함수

  app.post("/user", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var tempUser = "이것은 String 치즈 입니다.";
    res.send(tempUser);
  });

  // --------------------------------------외부 통신 ---------------------------------------------------------------------------

  app.get("/category/list", function (req, res) {
    dbEccList
      .collection("List")
      .find()
      .toArray(function (err, result) {
        res.json(result);
      });
  });

  //로그인시 회원 정보 넘겨주는 api
  app.get("/user/signIn/uid", function (req, res) {
    const { uid } = req.query;

    dbAccount.findOne({ uid: uid }).toArray((err, result) => {
      if (err) throw err;

      res.json(result);
    });
    // 이메일 찾는 api
    app.get("/user/findEmail", function (req, res) {
      const { name, birth } = req.query;
      dbAccount
        .collection("User")
        .findOne({ name: name, birth: birth })
        .toArray((err, result) => {
          if (err) throw err;

          res.json(result);
        });
    });
  });
  // 학생 리스트를 전달해주는 api
  app.get("/getStudent", function (req, res) {
    dbStudent
      .collection("A")
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        res.json(result);
      });
  });

  // query로 온 학생의 정보를 전달하는 api
  app.get("/student", function (req, res) {
    const { name, birth } = req.query;
    const findQuery = "name: " + name;
    if (birth != null) {
      findQuery = "name: " + name + ", birth: " + birth;
    }

    dbStudent
      .collection("A")
      .find({ findQuery })
      .toArray((err, result) => {
        if (err) throw err;

        res.json(result);
      });
  });

  // 카테고리(대분류,소분류)정보를 받고 ecc list를 전달하는 api
  app.get("/checklist/category", function (req, res) {
    const { level1, level2 } = req.query;
    dbEccList
      .collection("List")
      .find({ [level1]: { $exists: true } })
      .toArray((err, result) => {
        if (err) throw err;
        const sendData = result[0][level1][level2];
        res.json(sendData);
      });
  });

  app.get("/checklist/history/list/post", function (req, res) {
    const [startDate, endDate] = req.query;
  });

  app.post("/user/signUp", function (req, res) {
    res.json(req.params);
    res.json(req.body);

    // dbAccount.collection('User').insertOne()
  });

  // --------------------------------------외부 통신 ---------------------------------------------------------------------------

  app.get("https://yts.mx/api/v2/list_movies.json", function (req, res) {});

  // 가장최신 사전평가를 불러오는 함수
  app.get("/getLastPretestData", function (req, res) {
    getLastDate.getLastDateInPreTest(req, res);
    // projection으로 date만 불러오고 그중 최신값 간추려냄, 그 후에 다시 find로 최근 사전평가를 불러옴
  });

  // 가장최신 사전평가를 불러오는 함수

  // ECC REST API 통신
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build/index.html"));
  });

  // ----------------------------------------------------------------post----------------------------------------------------------------------------------------//

  // 학생을 등록하는 메소드
  app.post("/addStudent", (req, res) => {
    dbStudent.collection("A").insertOne(req.body, function (err, result) {
      if (err) throw err;
    });

    // db.collection('test_apple').ubdateOne({},{})
  });

  // 사전평가 저장하는 함수
  app.post("/putPreEccData", (req, res) => {
    dbEccEvaluationData
      .collection("PreTest")
      .insertOne(req.body, function (err, result) {
        if (err) throw err;
      });

    // 각 카테고리의 최신 평가 시간 갱신 메소드

    // dbEccEvaluationData.collection('PreTestRecent').updateOne({uid:req.body.uid},{$set:{recentDate:req.body.date}}, function (err, result) {
    //     if (err) throw err;
    //     console.log('저장 성공')
    // });

    res.send("성공");
  });

  // 사전평가 저장하는 함수

  // 사후평가 저장하는 함수

  app.post("/putPostEccData", function (request, response) {
    const { date, uid } = request.body;
    dbEccEvaluationData
      .collection("PostTest")
      .insertOne(request.body, function (err, result) {
        if (err) throw err;
      });
    dbStudent
      .collection("A")
      .updateOne(
        { _id: ObjectId(uid) },
        { $set: { recent: date } },
        (err, result) => {}
      );
  });

  // 사후평가 저장하는 함수

  // 회원가입 메소드
  app.post("/doingSignUp", (req, res) => {
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    userInformation = req.body;
    // split으로 쪼개서 각각 대입
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return err;
      bcrypt.hash(
        userInformation.password,
        salt,
        function (err, hashedPassword) {
          if (err) return err;
          userInformation.password = hashedPassword;
          dbAccount
            .collection("User")
            .insertOne(req.body, function (err, result) {});
        }
      );
    });
    res.redirect("/signIn");
  });

  // 회원가입 실패시 새로고침 메소드

  app.post("/again", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(`<script>
    alert('회원 정보에 _가 포함되어 있습니다.');
    history.back();
</script>`);
    // redirect로 뒤로가기 하는법
    // res.redirect(req.header('Referer')|| '/');
  });
  // ecc데이터 저장 메소드 끝

  // 회원 인증 API
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const session = require("express-session");
  const { send } = require("process");
  const { throws } = require("assert");

  app.use(
    session({ secret: "secretCode", resave: true, saveUninitialized: false })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/login", function (req, res) {});

  app.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/signUp",
    }),
    function (req, res) {
      res.redirect("/");
    }
  );

  // 로그인 검사 미들웨어

  passport.use(
    new LocalStrategy(
      {
        // name 속성
        usernameField: "email",
        passwordField: "password",
        session: true,
        passReqToCallback: false,
      },
      function (email, password, done) {
        dbAccount
          .collection("User")
          .findOne({ email: email }, function (err, res) {
            if (err) return done(err);

            if (!res)
              return done(null, false, { message: "존재하지않는 아이디요" });
            bcrypt.compare(password, res.password).then((isMatch) => {
              if (isMatch) {
                return done(null, res);
              } else {
                return done(null.false, { message: "비번 틀렸어요" });
              }
            });
          });
      }
    )
  );

  passport.serializeUser(function (res, done) {
    done(null, res.email);
  });
  passport.deserializeUser(function (id, done) {
    done(null, {});
  });
});

//   원본 passport
//   passport.use(new LocalStrategy(function verify(username, password, cb) {
//     db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
//       if (err) { return cb(err); }
//       if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

//       crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//         if (err) { return cb(err); }
//         if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//           return cb(null, false, { message: 'Incorrect username or password.' });
//         }
//         return cb(null, row);
//       });
//     });
//   }));

// 그래프 c의 갯수
app.get("/getStudentCCount", function (req, res) {
  const { uid } = req.query;
  dbEccEvaluationData
    .collection("PostTest")
    .aggregate(
      { $match: { uid: uid, "result.score": "C" } },
      {
        $group: {
          _id: { content: "$result.content", id: "$_id", date: "$date" },
          count: { $sum: 1 },
        },
      }
    )
    .toArray(function (err, result) {
      if (err) throw err;

      res.send(result);
    });
});
// 그래프 c의 갯수

// 문항당 C의 변화량
app.get("/getCategoryCCountChange", function (req, res) {
  let { uid, level1, level2 } = req.query;
  dbEccEvaluationData
    .collection("PostTest")
    .aggregate(
      {
        $match: { uid: uid, "result.score": "C" },
        level1: level1,
        level2: level2,
      },
      {
        $group: {
          _id: {
            bigCategory: "$bigCategory",
            smallCategory: "$smallCategory",
            content: "$result.content",
            id: "$_id",
            date: "$date",
          },
          count: { $sum: 1 },
        },
      }
    )
    .toArray(function (err, result) {
      if (err) throw err;

      res.send(result);
    });
});
// 문항당 C의 변화량
