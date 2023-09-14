// const express = require('express')
// const app = express()
// const multer = require('multer')
// const path =require('path')
// app.use(express.static(path.join(__dirname,'public')))

const multer  =require('multer');

const path = require('path');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/brandImages'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
    cb(null,name);
    }
});

const brandImage = multer({storage:storage})



module.exports = brandImage