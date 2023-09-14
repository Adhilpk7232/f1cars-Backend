const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    planId:{
        type:mongoose.Types.ObjectId,
        ref:'Plan',
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true
    },
    StartDate:{
        type:Date,
        default:new Date()
    },
    expiryDate:{
        type:Date,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('Subscription',subscriptionSchema)