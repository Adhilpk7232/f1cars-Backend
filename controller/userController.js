const mongoose = require('mongoose')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mailer= require('../middleware/otpVerification')
const UserRepository = require('../repository/user.repository')
const userRepository = new UserRepository()
const Reviewer = require('../model/expertReviewer')
const Connection = require('../model/connection');
const Tax = require('../model/tax');
const Message = require('../model/message')
const Car = require('../model/car')



const securePassword = async(password) => {
    try{
        const passwordHashed = await bcrypt.hash(password,10)
        return passwordHashed
    }catch(error){
        console.log(error);
    }
}
const postRegister = async(req,res)=>{
    try{
        let name = req.body.name;
    let email = req.body.email
    let password = req.body.password
    let state = req.body.state
    const otp = mailer.OTP
    let mailDetails = {
        from:  "elite12eshopie@gmail.com",
        to: email,
        subject: "Otp for E-shoes varification",
        html: `<p>Hi ${name} ..Your OTP FOR registration on E-SHOES:  ${otp}<P>`,
    };
    const check = await User.findOne({email:email})
    if(check){
        return res.status(400).send({
            message:'Email is already registered'
        })
    }else{
        const hashedPassword = await securePassword(password)
        console.log(otp);

        
        mailer.mailerTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("otp has sented");
            }
        });
        const user ={
            name:name,
            email:email,
            state:state,
            password:hashedPassword,
            otp:otp
        }
        // const added = await user.save()
        const newUser = await userRepository.createUser(user)
        // const {_id} = await newUser.toJSON()
        // const token = jwt.sign({ _id:newUser._id },"TheSecreteKey",{ expiresIn: '10h' })
        res.json({
            // token:token,
            message:'verification mail send to your email'
        })
    }
    }catch(error){
        console.log(error.message);
    }
}

const otpResend =async(req,res)=>{
    try{
        const Useremail = req.params.email
            const user = await User.findOne({email:Useremail})
            const userId = user._id
            // const user = await userRepository.getUserById(userId)
            const name = user.name
            const email = user.email
            const otp = mailer.OTP
            let mailDetails = {
                from:  "elite12eshopie@gmail.com",
                to: email,
                subject: "Otp for E-shoes varification",
                html: `<p>Hi ${name} ..Your OTP FOR registration on E-SHOES:  ${otp}<P>`,
            };

            mailer.mailerTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(mailer.OTP);
                    console.log("resendOtp has sented");
                }
            });
            const done = await User.updateOne({ _id: userId }, { $set: { otp: otp } });
            if(done){
                console.log("otp updated on");
                res.json({
                    message:'success'
                })
            }
    }catch(error){
        console.log(error.message);
    }
    
}
const otpVerify = async(req,res)=>{
    try{     
        // const token = req.headers.authorization?.split(" ")[1];
        // jwt.verify(token,'TheSecreteKey',async(err,decoded) => {
        //     if(err){
        //         return res.status(401).json({
        //             message:'unauthenticated'
        //         })

        //     }else{
                const userEmail = req.params.email
                const otp = parseInt(req.body.otp)
                
                // const user = await userRepository.getUserById(userId)
                const user = await User.findOne({email:userEmail})
                const userId = user._id
                    console.log(typeof user.otp,"jjj");
                if(user.otp === otp){
                    const token = jwt.sign({_id:user._id},"TheSecreteKey",{ expiresIn: '10h' })
                    const userId =user._id
                    const userData = {isVerified:1}
                    // const updated = await User.updateOne({_id:claims._id},{$set:{isVerified:1}})
                    const updated = await userRepository.updateUserById(userId,userData)
                    res.json({
                        message:"verified success",
                        token:token
                    })
                    
                }else{
                    return res.status(404).send({
                        message:"Incorrect Otp"
                    })
                }
        //     }
        // })
            
            
    }catch(error){
        console.log(error);
    }
}
const postLogin = async(req,res)=>{
    const email = req.body.email
    // await User.findOne({email:})
    const GettingUser = await userRepository.findUserByEmail(email)
    console.log(GettingUser,"here the user");
    if(!GettingUser){
        return res.status(404).json({
            message:"User not Found"
        })
    }
    if(!(await bcrypt.compare(req.body.password,GettingUser.password))){
        return res.status(404).json({
            message:"Password Incorrect"
        })
    }
    if(GettingUser.blocked){
        return res.status(404).json({
            message:"This Account is blocked"
        })
    }
    if(GettingUser.isVerified === 0){
        const name = GettingUser.name
        const email = GettingUser.email
        const otp = mailer.OTP
        let mailDetails = {
            from:  "elite12eshopie@gmail.com",
            to: email,
            subject: "Otp for F1CARS varification",
            html: `<p>Hi ${name} ..Your OTP FOR registration on F1CARS:  ${otp}<P>`,
        };

        mailer.mailerTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            res.status(401).json({
                message:'failed',
                error:'nodemailer Error'
            })
        } else {
            console.log(mailer.OTP);
            console.log("login otp has sented");
        }
    });
    const userId = GettingUser._id
    const updateData = { otp: otp }
    const done = await userRepository.updateUserById(userId,updateData)
    
    if(done){
        console.log("otp updated on");
        const token = jwt.sign({ _id:GettingUser._id },"TheSecreteKey",{ expiresIn: '10h' })
        
        res.json({
            message:'success',
            isVerified :0,
            token:token,
            userEmail:GettingUser.email
        })
    }
    }else if(GettingUser.blocked===true){
        return res.status(404).json({
            error:"This Account is blocked"
        })
    }
    else{
        const token = jwt.sign({ _id:GettingUser._id },"TheSecreteKey",{ expiresIn: '10h' })
        
        res.json({
            message:'success',
            isVerified :1,
            token:token,
            userEmail:GettingUser.email
        })
    }
}
const logout = async(req,res)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                });
            } else {
                const userId = decoded._id;                                
                res.json({message:"success"})
            }
        });
    }catch(error){
        console.log(error.message);
    }
    
}
const forgetPasswordUserFind = async(req,res)=> {

    try{
        const email = req.body.email
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(401).json({ message: 'User Not Found' });
        }
        const name = user.name
        const otp = mailer.OTP
        console.log(otp,"forgetOTP");
        let mailDetails = {
            from:  "elite12eshopie@gmail.com",
            to: email,
            subject: "Otp for F1CARS varification",
            html: `<p>Hi ${name} ..Your OTP FOR registration on F1CARS:  ${otp}<P>`,
        };

        mailer.mailerTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(mailer.OTP);
            console.log("login otp has sented");
        }
    });
    const userDetails = await User.findOne({email:email})
    const userId = userDetails._id
    const updateData = { otp: otp }
    const done = await userRepository.updateUserById(userId,updateData)
    const token = jwt.sign({ _id:done._id },"TheSecreteKey",{ expiresIn: '10h' })
    
    if(done){
        res.json({
            message:'success'
        })
    }

        // res.json(user)

    }catch(error){
        console.log(error.message);
        // res.status(500).json({ error: 'Internal Server Error' });
    }
}
const forgetOtpVerify = async(req,res)=>{

    
    
    try{
        const otp = parseInt(req.body.otp)
        const email = req.body.email
        console.log(typeof otp,"email fpr");
        const userData = await User.findOne({email:email})
            if(userData.otp === otp){
                
                res.json({
                    message:"verified success"
                })
                
            }else{
                return res.status(404).send({
                    message:"Incorrect Otp"
                })
            }
    }catch(error){
        console.log(error);
    }
}
const resetPassword = async (req,res)=>{
    try{
        const password = req.body.password
        const email = req.params.email
        const secure_password = await securePassword(password)

        const updatedData = await User.updateOne({email:email},{$set:{password:secure_password}})
        res.json({message:"success"})

    }catch(error){
        console.log(error.message);
        
    }
}
const userDetails =async(req,res) => { 
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey', async (err, decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                });
            } else {
                const userId = decoded._id;                 
                const userData = await User.findOne({_id:userId}).populate('state').exec();           
                res.json(userData)
            }
        });

    }catch(error){
        console.log(error.message)
    }
}
const updateUser = async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey',async(err,decoded) => { 
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                });
            }else{
                const userId = decoded._id
                const update = await User.findOne({_id:userId})
                const user = req.body
                const updateUser = await User.updateOne({_id:userId},{$set:{
                    name:user.name,
                    email:user.email,
                    city:user.city,
                    state:user.state
                }})
                if(updateUser){
                    res.json({message:'success'})
                }
            }
        })

    }catch(error){
        console.log(error.message);
    }
}
const updateProfile = async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey',async(err,decoded) => {
            if (err) {
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                });
            } else {
                const userId = decoded._id;                 
                let image = req.file.filename;
                const userData = await User.updateOne({_id:userId},{$set:{image:image}})        
                res.json({message:"success"})       
            }

        })
        

    }catch(error){
        console.log(error.message);
    }
}

const getReviewers = async(req,res) => { 
    try{
        const reviewers = await Reviewer.find({})
        res.json(reviewers)

    }catch(error){
        console.log(error.message);
    }
}
const createConnection = async(req,res) => { 
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey',async(err,decoded) => {
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                });
            }else{
                const userId = decoded._id
                const reviewerId = req.params.reviewerId
                const connection = await Connection.findOne({
                    'user':userId,
                    'reviewer':reviewerId
                })
                if(connection){
                    return res.json({
                        messsage:'success',
                        viewerId:userId
                    })
                }else{
                    let connectionData = {
                        user:userId,
                        reviewer:reviewerId
                    }
                    const connection = await Connection.create(connectionData)
                    return res.json({
                        message:'success',
                        viewerId:userId
                    })
                }
            }
        })

    }catch(error){
        console.log(error.message);
    }
}
const findConnection = async(req,res) => { 
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey',async(err,decoded) => {
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                })
            }else{
                const userId = decoded._id
                const connectionData = await Connection.find({user:userId}).populate('reviewer').exec()
                if(connectionData){
                    console.log(connectionData,"connectionData");
                    return res.json({connectionData:connectionData,
                    userId:userId})
                }
                
            }
        })

    }catch(error){
        console.log(error.message);
    }
}


const getStates = async(req,res) => { 
    try{
        const allStates = await Tax.find({})
        if(allStates){
            res.json({
                message:'success',
                StatesData:allStates
            })
        }else{
            res.status(401).json({
                error:'failed'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}
const getChattingReviewer = async(req,res) =>{
    try{
        const token = req.headers.authorization?.split(" ")[1]
        jwt.verify(token,'TheSecreteKey',async(err,decoded) => { 
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
        jwt.verify(token,'TheSecreteKey',async(err,decoded) => { 
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
                    if(connectionData.reviewer!== userId){
                        const newMessage ={
                            connectionId:connectionId,
                            from:userId,
                            to:connectionData.reviewer,
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
                            to:connectionData.reviewer,
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

const getAllMessages =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey',async(err,decoded) => { 
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

const getUserId =async(req,res) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        jwt.verify(token,'TheSecreteKey',async(err,decoded) =>{
            if(err){
                res.status(401).json({
                    userId:'authentication failed'
                })
            }else{
                const userId = decoded._id
                if(userId){
                    res.json({
                        userId:userId
                    })
                }
            }
        })

    }catch(error){
        console.log(error.message);
    }
}

const getTaxData = async(req,res) =>{
    try{
        
        const taxId = req.params.id
        console.log(taxId);
        const taxData = await Tax.findOne({_id:taxId})
        if(taxData){
            console.log(taxData,"taxData");
            res.json(taxData)
        }

    }catch(error){
        console.log(error.message);
    }
}

const getFilterData = async(req,res) =>{
    try{
        const uniqueBodyTypes = await Car.distinct('bodytype');
    const uniqueTransmissions = await Car.distinct('transmission');
    const uniqueFuelTypes = await Car.distinct('fuelType');
    const uniqueSeatCapacities = await Car.distinct('seatCapacity');
    console.log(uniqueBodyTypes,"body",uniqueTransmissions,"transmission",uniqueFuelTypes,"fuel",uniqueSeatCapacities,"seatcapacity");

    // Return the results as JSON
    res.json({
      uniqueBodyTypes,
      uniqueTransmissions,
      uniqueFuelTypes,
      uniqueSeatCapacities,
    });

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports ={
    postRegister,
    otpResend,otpVerify,postLogin,logout,forgetPasswordUserFind,forgetOtpVerify,resetPassword,
    userDetails,updateProfile,getReviewers,createConnection,findConnection,
    updateUser,getStates,
    getChattingReviewer,postMessage,
    getAllMessages,
    getUserId,
    getTaxData,
    getFilterData

}