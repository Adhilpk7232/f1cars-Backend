const mongoose = require('mongoose')

const brandschema = new mongoose.Schema({
    brand:{
        type:String,
        unique:true,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    unList:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Brand",brandschema)