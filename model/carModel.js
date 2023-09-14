const mongoose = require('mongoose')
const { array } = require('../middleware/multer')

const carModelSchema = new mongoose.Schema({
    carName:{
        type:String,
        required:true

    },
    brand:{
        type:mongoose.Types.ObjectId,
        ref:'brand',
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    mailage:{
        type:Number,
        required:true
    },
    engine:{
        type:Number,
        required:true
    },
    fuelType:{
        type:String,
        required:true
    },
    transmission:{
        type:String,
        required:true
    },
    power:{
        type:Number,
        required:true
    },
    features:[{
        featuresContent:{
            type:String,
            required:true
        }
    }],
    description:{
        type:String,
        required:true
    },
    colors:[{
        colorName:{
            type:String,
            required:true
        }
    }],
    pros:[{
        pros:{
            type:String,
            required:true
        }
    }],
    cons:[{
        cons:{
            type:String,
            required:true
        }
    }],
    varient:[{
        version:{
            type:String,
        },
        color:[{
            type:String,
        }],
        fuelType:{
            type:String,
        },
        transmission:{
            type:String,
        },
        price:{
            type:Number,
        }

    }]
})

module.exports = mongoose.model('CarModel',carModelSchema)