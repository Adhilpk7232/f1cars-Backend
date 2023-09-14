const mongoose = require('mongoose')

const planSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    validityMonth:{
        type:Number,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        default:new Date()
    },
    unList:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model("Plan",planSchema)