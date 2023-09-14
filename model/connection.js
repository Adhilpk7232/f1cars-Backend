const mongoose = require('mongoose')
 const connectionSchema =  new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    reviewer:{
        type:mongoose.Types.ObjectId,
        ref:'Reviewer',
        required:true
    }
 },{timestamps:true})

 module.exports = mongoose.model('Connection',connectionSchema)