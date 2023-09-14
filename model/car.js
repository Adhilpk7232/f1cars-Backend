const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    carName:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        requuired:true
    },
    maileage:{
        type:Number,
        required:true
    },
    engine:{
        type:Number,
        required:true
    },
    safety:{
        type:String,
        required:true
    },
    bodytype:{
        type:String,
        required:true

    },
    fuelType:[{
        type:String,
        required:true
    }],
    transmission:[{
        type:String,
        required:true
    }],
    seatCapacity:{
        type:String,
        required:true
    },
    colors:[{
        colorName:{
            type:String,
            required:true
        },
        color:{
            type:String,
            required:true
        },
        colorImage:{
            type:String,
            required:true
        }
    }],
    role:{
        type:String,
        default:'popular'
    },
    lauchedDate:{
        type:Date,
        default:new Date()

    },
    unList:{
        type:Boolean,
        default:false
    },
    
    
})

module.exports = mongoose.model('Car',carSchema)