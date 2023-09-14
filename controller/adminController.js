
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../model/user');
const mailer= require('../middleware/otpVerification')
const Admin = require('../model/admin');
const CarDealer = require('../model/carDealer')
const Brand = require('../model/brand')
const Car = require('../model/car')
const ExpertReviewer = require('../model/expertReviewer');
const carReview = require('../model/carReviewnew')

const brandImage = require('../middleware/multer')
const Tax = require('../model/tax')

const securePassword = async(password) => {
    try{
        const passwordHashed = await bcrypt.hash(password,10)
        return passwordHashed
    }catch(errro){
        console.log(error);
    }
}

const getAdmin =async (req,res) => {
    const GettingUser = await Admin.findOne({email:req.body.email})
    if(!GettingUser){
        return res.status(404).send({
            message:'Usernot found'
        })
    }
    if(!(req.body.password ==GettingUser.password)){
        return res.status(404).send({
            message:"Password is Incorrect"
        })
    }
    const token = jwt.sign({_id:GettingUser._id},"TheSecretKeyofAdmin",{ expiresIn: '10h' })
    
    res.json({
        message: "success"
    })
}
const active =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];

        jwt.verify(token,'TheSecretKeyofAdmin', async (err, decoded) => {
            if (err) {

                res.status(401).json({
                    auth: false,
                    status: "failed",
                    error: "Failed to authenticate",
                });
            } else {

                const adminId = decoded._id;
                
                const GettingUser = await Admin.findOne({_id:adminId})
                const {password,...data}=await GettingUser.toJSON()
                res.json({
                    message:'Authenticated'
                })
            }
        });
        
    }catch(error){
        return res.status(401).send({
            message:'UnAuthenticated'
        })
    }
}
const adminLogout = async(req,res)=> {
    try{
        res.cookie('jwt','',{
            maxAge:0
        })
        res.json({message:"success"})

    }catch(error){
        console.log(error.message);
    }
}
const adminLogin =async(req,res) => {
    console.log("helolo in login");
    const GettingUser = await Admin.findOne({email:req.body.email})
    console.log(GettingUser);
    if(!GettingUser){
        return res.status(404).send({
            message:"User not Found",
            token:'',
        })
    }
    if(!(req.body.password==GettingUser.password)){
        return res.status(404).send({
            message:"Password is Incorrect",
            token:'',
        })  
    }
    const token = jwt.sign({_id:GettingUser._id},"TheSecretKeyofAdmin",{ expiresIn: '10h' })
    
    try{
        console.log(req.body,"hello");
        const email = req.body.email
        const user = await Admin.findOne({email:email})
        if(!user){
            return res.json({ 
                message: 'User Not Found',
                token:''
             });
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
            console.log("hello");
        } else {
            console.log(mailer.OTP);
            console.log("login otp has sented");
        }
    });
    const userDetails = await Admin.findOne({email:email})
    const userId = userDetails._id
    const updateData = { otp: otp }
    const done = await Admin.updateOne({_id:userId},{$set:{otp: otp}})
    
    if(done){
        console.log("otp updated on");
        res.json({
            token:'',
            message:'success'
        })
    }

        // res.json(user)

    }catch(error){
        console.log('error in login navigation');
        console.log(error.message);
        // res.status(500).json({ error: 'Internal Server Error' });
    }
    
}
const resendOtp = async(req,res) => {
    try{

                const adminEmail = req.params.adminEmail
                const user = await Admin.findOne({email:adminEmail})
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
                        console.log("hello");
                    } else {
                        console.log(mailer.OTP);
                        console.log("resendOtp has sented");
                    }
                });
                const done = await Admin.updateOne({ _id: user._id }, { $set: { otp: otp } });
                if(done){
                    console.log("otp updated on");
                    return res.json({
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

        // jwt.verify(token,'TheSecretKeyofAdmin', async (err, decoded) => {
        //     if (err) {

        //         res.status(401).json({
        //             auth: false,
        //             status: "failed",
        //             message: "Failed to authenticate",
        //         });
        //     } else {
                const adminEmail = req.params.email
                const otp = parseInt(req.body.otp)
                // const adminId = decoded._id;
                const user = await Admin.findOne({email:adminEmail})
                

                if(user.otp === otp){
                    const token = jwt.sign({_id:user._id},"TheSecretKeyofAdmin",{ expiresIn: '10h' })
                    console.log("done");
                    return res.json({
                        message:"success",
                        token:token
                    })
                    
                }else{
                    return res.status(404).json({
                        message:"Incorrect Otp"
                    })
                }
        //     }
        // });

        
    }catch(error){
        console.log(error);
    }
}
const usersList =async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];

        jwt.verify(token,'TheSecretKeyofAdmin', async (err, decoded) => {
            if (err) {

                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                });
            } else {

                const userId = decoded._id;
                
                const GettingUser = await User.find({})

                res.json(GettingUser)
            }
        });

        

    }catch(error){
        return res.status(401).send({
            welcome:"UnAuthenticated"
        })
    }
}
const deleteUser =async(req,res) => {
    try{
        console.log("deleteInUser");
        await User.deleteOne({_id:req.params.id})
        const GettingUser = await User.find({})

        res.send(GettingUser)

    }catch(errro){
        return res.status(401).json({
            error:"UnAuthenticated"
        })    
    }
}
const blockUser =async(req,res)=>{
    try{
        console.log("blocker in ");
        const user = await User.findOne({_id:req.params.id})
        console.log(user);
        if(user.blocked === false){
            const blocked = await User.updateOne({_id:req.params.id},{$set:{blocked:true}});
            console.log(blocked,"done");
            const allUsers = await User.find({})
            res.json({message:'blocked',user:allUsers})

        }else{
            const unBlocked = await User.updateOne({_id:req.params.id},{$set:{blocked:false}});
            const allUsers = await User.find({})
            res.json({message:'Unblocked',user:allUsers})
        }
    }catch(error){
        console.log(error.message);
        return res.status(401).json({
            error:"UnAuthenticated"
        }) 
    }
}
const edituser =async(req,res) => { 
    let id = req.params.id
    let name = req.body.name;
    let email = req.body.email;
    console.log(name,email);
    try{
        const check = await User.findOne({_id:id})
    
        const update = await User.updateOne({_id:check._id},{$set:{name:name,email:email}})
        console.log(update,"lllooo");
        res.json({
            message: "success"
        })
    }catch(error){
        if (error.code === 11000) {
            // Handle the duplicate key error here
            console.error("Duplicate key error: Email already exists.");
            res.status(404).json({
                message:'Email already exists'
            })
            // You can choose to take specific actions or return an error response.
          } else {
            // Handle other MongoDB errors here
            console.error("MongoDB error:", error);
          }
    }
    

    
}
const userDeatails = async (req,res) => { 
        try{
            console.log("In deit Deatils");
            const GettingUser  = await User.findOne({_id:req.params.id})
            console.log(GettingUser);
            res.send(GettingUser)
    
        }catch(error){
            return res.status(401).send({
                welcome:"UnAuthenticated"
            })
        }
    }
const createUser = async (req,res) => {
    let name= req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    const check = await User.findOne({email:email})
    if(check){
        return res.status(400).send({
            message: "Email is already registered"
        })
    }else{
        const hashedPassword = await securePassword(password)
        const user = new User({
            name:name,
            email:email,
            password:hashedPassword
        })
        const added = await user.save();
        res.json({
            message:'success'
        })
    }
}
const reviewer = async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];

        jwt.verify(token,'TheSecretKeyofAdmin', async (err, decoded) => {
            if (err) {

                res.status(401).json({
                    auth: false,
                    status: "failed",
                    errro: "Failed to authenticate",
                });
            } else {

                const adminId = decoded._id;
                
                const GettingUser = await ExpertReviewer.find({})

                res.json(GettingUser)
            }
        });

    }catch(error){
        return res.status(401).send({
            error:"UnAuthenticated"
        })
    }
} 
const deleteReviewer = async(req,res) => {
    try{
        console.log("deleteInUser");
        await ExpertReviewer.deleteOne({_id:req.params.id})
        const GettingUser = await ExpertReviewer.find({})

        res.json(GettingUser)

    }catch(errro){
        return res.status(401).send({
            error:"UnAuthenticated"
        })    
    }
}
const editReviewer = async(req,res) => {
    const reviewerId = req.params.reviewerId 
    let name = req.body.name;
    let email = req.body.email;
    let city = req.body.city
    console.log(req.body);

    const check = await ExpertReviewer.findOne({email:email})
    
    if(check && email!=check.email ){
        return res.status(400).send({
            message:"Email is already registered"
        })
    }else{
        const updated = await ExpertReviewer.updateOne({_id:reviewerId},{$set:{name:name,email:email,city:city}})
        console.log(updated);
        res.json({
            message: "success"
        })

    }
}
const reviewerDeatails = async (req,res) => { 
    try{
        console.log("In deit Deatils");
        const GettingUser  = await ExpertReviewer.findOne({_id:req.params.id})
        console.log(GettingUser);
        res.json(GettingUser)

    }catch(error){
        return res.status(401).send({
            error:"UnAuthenticated"
        })
    }
}
const createReviewer = async (req,res) => {
    let name= req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let city = req.body.city
    const check = await ExpertReviewer.findOne({email:email})
    if(check){
        return res.status(400).send({
            message: "Email is already registered"
        })
    }else{
        const hashedPassword = await securePassword(password)
        const expertReviewer = new ExpertReviewer({
            name:name,
            email:email,
            password:hashedPassword,
            city:city
        })
        const added = await expertReviewer.save();
        res.json({
            message:'success'
        })
    }
}
const dealer = async(req,res) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];

        jwt.verify(token,'TheSecretKeyofAdmin', async (err, decoded) => {
            if (err) {

                res.status(401).json({
                    auth: false,
                    status: "failed",
                    errro: "Failed to authenticate",
                });
            } else {

                const adminId = decoded._id;                
                const GettingUser = await CarDealer.find({})
                res.json(GettingUser)
            }
        });
        

    }catch(error){
        return res.status(401).send({
            error:"UnAuthenticated"
        })
    }
}
const deleteDealer = async(req,res) => {
    try{
        console.log("deleteInUser");
        await CarDealer.deleteOne({_id:req.params.id})
        const GettingUser = await CarDealer.find({})

        res.send(GettingUser)

    }catch(errro){
        return res.status(401).send({
            error:"UnAuthenticated"
        })    
    }
}
const editDealer = async(req,res) => { 
    const dealerId = req.params.dealerId
    console.log(req.body,dealerId);
    console.log("whatsap");
    let name = req.body.CompanyName;
    let email = req.body.email;
    let brand = req.body.brand;
    let city= req.body.city;

    const check = await CarDealer.findOne({email:email})
    if(check && email!=check.email){
        return res.status(400).send({
            message:"Email is already registered"
        })
    }else{
        const data = await CarDealer.updateOne({_id:dealerId},{$set:{CompanyName:name,brand:brand,email:email,city:city}})
        console.log(data,"updated");
        res.json({
            message: "success"
        })

    }
}
const dealerDetails = async (req,res) => { 
    try{
        console.log("In deit Deatils");
        const GettingUser  = await CarDealer.findOne({_id:req.params.id})
        console.log(GettingUser);
        res.send(GettingUser)

    }catch(error){
        return res.status(401).send({
            welcome:"UnAuthenticated"
        })
    }
}

const createDealer = async (req,res) => {
    let CompanyName= req.body.CompanyName;
    let brand = req.body.brand;
    let email = req.body.email;
    let password = req.body.password;
    let city = req.body.city;
    console.log(req.body);
    const check = await CarDealer.findOne({email:email})
    if(check){
        return res.status(400).send({
            message: "Email is already registered"
        })
    }else{
        const hashedPassword = await securePassword(password)
        const carDealer = new CarDealer({
            CompanyName:CompanyName,
            brand:brand,
            email:email,
            password:hashedPassword,
            city:city
        })
        const added = await carDealer.save();
        res.json({
            message:'success'
        })
    }
}

const addTax = async(req,res) => { 
    try{
        const taxData = req.body
        let tax ={
            country:taxData.country,
            state:taxData.state,
            tax:taxData.tax
        }
        const AddTax = await Tax.create(tax)
        if(AddTax){
            res.json({
                message:'success'
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
const getAllTax = async(req,res) => { 
    try{
        const allTax = await Tax.find({})
        if(allTax){
            res.json({
                message:'success',
                allTaxData:allTax
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

const deleteTax = async(req,res) => { 
    try{
        const taxId = req.params.taxId
        const deleteTax = await Tax.deleteOne({_id:taxId})
        if(deleteTax){
            res.json({
            message:'success'
            })
        }else{
            res.status(401).json({
                error:'failed',
                message:'failed'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}
const uploadImage = async(req,res) => {
    try{
        let imageUrl = req.file.filename;
        console.log(imageUrl,"imagesting");
        if(imageUrl){
            return res.json(imageUrl)
        }else{
            return res.json({message:'image upload failed'})
        }
        

    }catch(error){

    }
}
const getTaxInfo  =async(req,res) =>{
    try{
        const TaxId = req.params.taxId
        const TaxData = await Tax.findOne({_id:TaxId})
        if(TaxData){
            res.json(TaxData)
        }

    }catch(error){
        console.log(error.message);
    }
}
module.exports ={
    getAdmin,
    active,
    adminLogin,
    usersList,deleteUser,blockUser,edituser,createUser,reviewer,deleteReviewer,editReviewer,
    reviewerDeatails,createReviewer,dealer,deleteDealer,editDealer,dealerDetails,createDealer,
    userDeatails,resendOtp,otpVerify,adminLogout,addTax,getAllTax,deleteTax,uploadImage,
    getTaxInfo
    
}