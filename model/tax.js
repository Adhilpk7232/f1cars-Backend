const mongoose = require('mongoose')

const taxSchema = new mongoose.Schema({
    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    tax:{
        type:Number,
        required:true
    }
})

module.exports  = mongoose.model('Tax',taxSchema)