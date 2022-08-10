const express = require('express');
const app = express();

app.listen(8080, function() {
    console.log('listening on 8080')
})
app.get('/', function(요청, 응답) { 
    응답.sendFile(__dirname +'/index.html')
  });
app.get('/pet', function(요청, 응답) { 
    응답.send('펫용품 사시오')
  })

  app.get('/user',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    var tempUser={"name":"asd",
    "birth":970204,
    "email":"으헤헤헤이거슨이메일",
    "uid":"유니크다음은 전설"
    }
    
    res.send(tempUser);
    console.log(tempUser);
    });
    