const mongoose = require('mongoose')

const dealerSchema = new mongoose.Schema({
    CompanyName:{
        type:String,
        required:true
    },
    brand:{
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

module.exports = mongoose.model('Dealer',dealerSchema)