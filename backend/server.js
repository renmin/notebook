const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data")

const API_PORT = 3001;

const app = express();
const router = express.Router();

//定义MongoDB数据库
// const dbRoute = " mongodb://test:test1234@ds37468.mlab.com:37468/notebook_app";
const dbRoute = "mongodb+srv://test:test1234@cluster0-jetpv.mongodb.net/notebook_app?retryWrites=true&w=majority";

//连接数据库
mongoose.connect(
    dbRoute,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
let db = mongoose.connection;

db.once("open", () => {console.log("connected to the database")});

// 检测数据库链接是否成功
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// 转换为可读的json格式
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// 开启日志
app.use(logger("dev"));

// 获取数据的方法
// 用于获取数据库中所有可用数据
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if(err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    });
});

// 数据更新方法
// 用于对数据库中已有数据进行更新
router.post('/updateData', (req, res) =>{
    const {id, update} = req.body;
    Data.findOneAndUpdate(id, update, err =>{
        if(err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

// 删除数据方法
// 用于删除数据库中已有数据
router.delete('/deleteData', (req, res) =>{
    const {id} = req.body;
    Data.findOneAndDelete(id, err =>{
        if(err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

// 添加数据方法
// 用于在数据库中增加数据
router.post('/putData', (req,res) => {
    let data = new Data();
    const {id, message} = req.body;

    if((!id && id !== 0) || !message){
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }
    data.message = message;
    data.id = id;
    data.save(err => {
        if(err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

// 对http请求增加api路由
app.use("/api", router);
// 开启端口
app.listen(API_PORT, () => console.log(`LISTENING ON POST ${API_PORT}`));
