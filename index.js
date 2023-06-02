const express = require('express')
const app = express()
const port = 3000

// 데이터베이스 명령어 함수들 사용하기 위해 불러들이는 작업
const MongoClient = require('mongodb').MongoClient;

app.set("view engine","ejs")
app.use(express.static('public'))

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

let db; //데이터베이스 연결을 위한 변수세팅(변수의 이름은 자유롭게 지어도 됨)

// mongodb 설치했을 때 가능한 명령어
// MongoClient.connect("본인의 데이터베이스 연결 주소",function(){})
MongoClient.connect("mongodb+srv://cisalive:cisaliveS2@cluster0.cjlsn98.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }
    //err <- DB에서 제공해주는 에러 메세지. 빨간색으로 틀린 부분 알려줌

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    // db = result.db("만들어준DB이름");
    db = result.db("AI_portfolio");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });

});

// 라우터 설정
app.get('/', (req, res) => {
    // 데이터를 찾아오는 구문 find() <-전부, findOne() <-하나만
    // 객체 단위로 나오는 데이터를 배열로 가져오게 하는 구문 toArray()
    // (에러메세지매개변수 err, 결과값매개변수 result )=>{}    
    db.collection("users").find().toArray((err, result)=>{
        res.render("index.ejs", {data:result})
    })
})

app.get("/board/list", (req, res) => {
    db.collection("free").find().toArray((err, result)=>{
        res.render("board_list.ejs", {content:result})
    })
})


//index.ejs에서 입력한 값을 /insert 요청 시 데이터와 함께 전달한다
// get - req.query post - req.body 암기
app.get('/insert', (req, res) => {
    // 데이터베이스 변수명.colletion("컬렉션명").insertOne({})
    // DB 안. 컬렉션에. 한번만 삽입할 것({삽입할 객체들}, ()=>{실행할 함수 구간})

    db.collection("users").insertOne({
        // 삽입할 객체 구간
        // 작명 : req.query.받아올 사용자 입력 태그들의 name,
        username : req.query.username,
        userid : req.query.userid,
        address : req.query.address
    },(err)=>{
        if(err){return console.log(err) } // 에러메세지출력 : 선택사항
        // res.send("데이터 저장 완료"); <- 데이터 잘 저장되는지 테스트
        // res.render("index.ejs"); <- 해당 파일에 저장
        res.redirect("/") //메인페이지 경로로 요청. (입력 후 메인페이지로 이동됨)
    })
})

app.get("/board/input", (req,res)=>{
    res.render("board_insert.ejs")
})



app.post('/board/insert', (req, res) => {
    // 데이터베이스 변수명.colletion("컬렉션명").insertOne({})
    // DB 안. 컬렉션에. 한번만 삽입할 것({삽입할 객체들}, ()=>{실행할 함수 구간})
   

    db.collection("free").insertOne({
        author : req.body.author,
        context : req.body.context
    },(err)=>{
        if(err){return console.log(err) } // 에러메세지출력 : 선택사항
        res.redirect("/board/list")
    })
})