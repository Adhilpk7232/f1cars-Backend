const mongoose = require('mongoose')

const reviewerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:null
    },
    city:{
        type:String,
        default:null
    },
    isVerified:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('Reviewer',reviewerSchema)