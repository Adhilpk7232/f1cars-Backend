const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Admin = require('../model/admin');
const CarDealer = require('../model/carDealer')
const Brand = require('../model/brand')
const Plan = require('../model/packagePlan')
const Car = require('../model/car')
const ExpertReviewer = require('../model/expertReviewer');
const CarReview = require('../model/carReviewnew')
const Connection =require('../model/connection')
const Message =require('../model/message')

const securePassword = async(password) => {
    try{
        const passwordHashed = await bcrypt.hash(password,10)
        return passwordHashed
    }catch(error){
        console.log(error);
    }
}

const getReviewDetails = async(req,res) => { 
    try{
        const reviewId = req.params.id
        const reviewData = await CarReview.findOne({_id:reviewId})
        if(reviewData){
            res.json(reviewData)
        }

    }catch(error){
            console.log(error.message);
    }
}
const updateReview = async(req,res)=>{
    try{
        console.log(req.body,"get updating review og car");
        let reviewId = req.params.id
        let content =req.body.content
        let heading = req.body.heading
        let shortestDescription = req.body.shortestDescription
        let overAllScore = req.body.overAllScore
        const updatereview = await CarReview.updateOne({_id:reviewId},{$set:{
            content:content,
            shortestDescription:shortestDescription,
            overAllScore:overAllScore,
            heading:heading
        }})
        if(updateReview){
            res.json({message:'success'})
        }

    }catch(error){
        console.log(error.message);
    }
}

const getAllreviews = async(req,res) => {
    try{
        const reviewData = await CarReview.find({unlist:false}).populate('reviewerId').exec()
        if(reviewData){
            
            res.json(reviewData)
        }else{
            res.json({message:'review is Empty'})
        }
    }catch(error){
        console.log(error.message);
    }
}
const getSingleReview = async(req,res) => { 
    try{
        const reviewId = req.params.reviewId;
        const SingleReview = await CarReview.findOne({_id:reviewId}).populate('reviewerId').populate('carId').exec()
        if(SingleReview){
            res.json(SingleReview)
        }else{
            res.status(401).json({message:'empty review'})
        }
    }catch(error){
        console.log(error.message);
    }
}
const findConnection = async(req,res) => { 
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer',async(err,decoded) => {
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                })
            }else{
                const userId = decoded._id
                const connectionData = await Connection.find({reviewer:userId}).populate('user').exec()
                if(connectionData){
                    return res.json({
                        reviewerConnectionData:connectionData,
                        viewerId:userId
                    })
                }
                
            }
        })

    }catch(error){
        console.log(error.message);
    }
}

const getReviewerId = async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer',async(err,decoded) => {
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                })
            }else{
                const reviewerId = decoded._id
                res.json(reviewerId)
            }
        })

    }catch(error){
        console.log(error.message);
    }
}

const getMessages =async(req,res) =>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer',async(err,decoded) => { 
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                })

            }else{
                const connectionId  = req.params.connectionId 
                const userId = decoded._id
                const allmessages = await Message.find({connectionId:connectionId}).sort({ createdAt: 1 });
                if(allmessages){
                    res.json(allmessages)
                }
                
            }
        })
        
        

    }catch(error){
        console.log(error.message);
    }
}
const getChattingReviewer = async(req,res) =>{
    try{
        const token = req.headers.authorization?.split(" ")[1]
        jwt.verify(token,'TheSecretKeyofReviewer',async(err,decoded) => { 
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                })
            }else{
                const userId = decoded._id
                const connectionId = req.params.connectionId
                const connectionData = await Connection.findOne({_id:connectionId}).populate('reviewer').populate('user').exec()
                if(connectionData){
                    res.json(connectionData)
                }
            }
        })

    }catch(error){
        console.log(error.message);
    }
}
const postMessage = async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1]
        jwt.verify(token,'TheSecretKeyofReviewer',async(err,decoded) => { 
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                })
            }else{
                const UserMsg = req.body.message
                const userId = decoded._id
                const connectionId =req.params.connectionId
                const connectionData = await Connection.findOne({_id:connectionId})
                if(connectionData){
                    if(connectionData.user!== userId){
                        const newMessage ={
                            connectionId:connectionId,
                            from:userId,
                            to:connectionData.user,
                            message:UserMsg
                        }
                        const saveMessage = await Message.create(newMessage);
                        if(saveMessage){
                            res.json(saveMessage)
                        }else{
                            res.status(401).json({
                                message:'failed'
                            })
                        }

                    }else{
                        const newMessage ={
                            connectionId:connectionId,
                            from:userId,
                            to:connectionData.user,
                            message:UserMsg
                        }
                        const saveMessage = await Message.create(newMessage);
                        if(saveMessage){
                            res.json(saveMessage)
                        }else{
                            res.status(401).json({
                                message:'failed'
                            })
                        }

                    }
                }

            }
        })

    }catch(error){
        console.log(error.message);
    }
}

const IsReviewer =async(req,res) => {
    try{
        const GettingReviewer = await ExpertReviewer.findOne({email:req.body.email})
    if(!GettingReviewer){
        return res.status(404).send({
            message:'Usernot found'
        })
    }
    if(!(await bcrypt.compare(req.body.password,GettingReviewer.password))){
        console.log('innn');
        return res.status(404).send({
            message:"Password Incorrect"
        })
    }
    const token = jwt.sign({_id:GettingReviewer._id},"TheSecretKeyofReviewer",{ expiresIn: '10h' })
    res.json({
        message: "success"
    })
    }catch(error){
        console.log(error.message);
    }
}
const logOut =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    error: "Failed to authenticate",
                });
            } else {
                const reviewerId = decoded._id;                
                console.log(reviewerId,"tt");                
                res.json({message:"success"})
            }
        });
    }catch(error){
        console.log(error.message);
    }
}
const active =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    errro: "Failed to authenticate",
                });
            } else {
                const reviewerId = decoded._id;                
                const GettingReviewer = await ExpertReviewer.findOne({_id:reviewerId})
                const {password,...data}=await GettingReviewer.toJSON()
                res.json(data)
            }
        });
        
    }catch(error){
        return res.status(401).json({
            error:"UnAuthenticated"
        })
    }
}
const postLogin =async(req,res) => {
    try{
        const GettingReviewer = await ExpertReviewer.findOne({email:req.body.email})
    if(!GettingReviewer){
        return res.status(404).json({
            message:"User not Found"
        })
    }
    if(!(await bcrypt.compare(req.body.password,GettingReviewer.password))){
        console.log('innn');
        return res.status(404).send({
            message:"Password Incorrect"
        })
    }
    const token = jwt.sign({_id:GettingReviewer._id},"TheSecretKeyofReviewer",{ expiresIn: '10h' })
    res.json({
        token:token,
        message: "success"
    })
    }catch(error){
        console.log(error.message);
    }
}
const getBrand =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    errro: "Failed to authenticate",
                });
            } else {
                const reviewerId = decoded._id;                
                const GettingUser = await Brand.find({})
                res.json(GettingUser)
            }
        });
    }catch(error){
        return res.status(401).json({
            error:"UnAuthenticated"
        })
    }
}
const getSingleCar =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    errro: "Failed to authenticate",
                });
            } else {
                const barndId = req.params.id
                const GettingCars = await Car.find({brand:barndId})
                res.json(GettingCars)
            }
        });
        

    }catch(error){
        return res.status(401).json({
            error:"UnAuthenticated"
        })
    }
}
const postAddReview =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    errro: "Failed to authenticate",
                });
            } else {
                let image = req.file.filename;
                const reviewerId = decoded._id
                const carId = req.body.carId
                const content = req.body.content
                const heading = req.body.heading
                const shortestDescription = req.body.shortestDescription
                const overallScore = parseInt(req.body.overAllScore)


                let carReview = {
                    reviewerId:reviewerId,
                    carId:carId,
                    heading:heading,
                    content:content,
                    shortestDescription:shortestDescription,
                    image:image,
                    overAllScore:overallScore
                    
            
                }
                const carReviewData =await CarReview.create(carReview)
                res.json({
                    message:'success'
                })
                    }
                });
   
        

    }catch(error){
        console.log(error.message);
    }
}
const getCarReview =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecretKeyofReviewer', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    errro: "Failed to authenticate",
                });
            } else {
                const reviewerId = decoded._id
                const GettingCarReviews = await CarReview.find({reviewerId:reviewerId}).populate('carId').exec();
                console.log(GettingCarReviews);
                res.json(GettingCarReviews)
            }
        });
        

    }catch(error){
        return res.status(401).json({
            error:"UnAuthenticated"
        })
    }
}

module.exports = {

    getReviewDetails,
    updateReview,
    getAllreviews,
    getSingleReview,
    findConnection,
    getReviewerId,
    getMessages,
    getChattingReviewer,
    postMessage,
    IsReviewer,
    logOut,
    active,
    postLogin,
    getBrand,
    getSingleCar,
    postAddReview,
    getCarReview

}