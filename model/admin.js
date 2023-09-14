const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
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
    isVerified:{
        type:Number,
        default:0
    },
    otp:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Admin',adminSchema)