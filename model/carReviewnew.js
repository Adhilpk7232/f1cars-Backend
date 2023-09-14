const mongoose  = require('mongoose')

const singleCarReviewSchema = new mongoose.Schema({
    reviewerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required:true
    },
    carId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required:true
    },
    heading:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    shortestDescription:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    overAllScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    unlist:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('singleCarReview',singleCarReviewSchema)