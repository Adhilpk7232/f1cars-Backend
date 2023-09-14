const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    },
    otp:{
        type:Number,
        required:true
    },
    blocked:{
        type:Boolean,
        default:false
    },
    state:{
        type:mongoose.Types.ObjectId,
        ref:'Tax',
        required:true
    },
    wishlist:[{
        car:{
            type:mongoose.Types.ObjectId,
            ref:"Car",
            required:true
        }
    }]
})

module.exports = mongoose.model('User',userSchema)

