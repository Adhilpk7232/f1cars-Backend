const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Admin = require('../model/admin');
const CarDealer = require('../model/carDealer')
const Brand = require('../model/brand')
const Plan = require('../model/packagePlan')
const Car = require('../model/car')
const ExpertReviewer = require('../model/expertReviewer');
const carReview = require('../model/carReviewnew')
const Subscription = require('../model/subscription');


// const brand = async(req,res)=>{
//     try{
//         const token = req.headers.authorization?.split(" ")[1];

//         jwt.verify(token,'TheSecretKeyofAdmin', async (err, decoded) => {
//             if (err) {

//                 res.status(401).json({
//                     auth: false,
//                     status: "failed",
//                     message: "Failed to authenticate",
//                 });
//             } else {

//                 const userId = decoded._id;
//                 const getPlans = await Plan.find({})
//                 res.send(getPlans)
//             }
//         });
        

//     }catch(error){
//         return res.status(401).send({
//             error:"UnAuthenticated"
//         })
//     }
// }

// const deleteBrand = async(req,res) => {
//     try{
//         await Plan.deleteOne({_id:req.params.id})
//         const deletePlan  = await Plan.find({})

//         res.send(deletePlan)

//     }catch(errro){
//         return res.status(401).send({
//             welcome:"UnAuthenticated"
//         })    
//     }
// }
const createPlan = async (req,res) => {

    let name= req.body.name;
    let description = req.body.description
    let validityMonth = req.body.validityMonth
    let price = req.body.price
    const exist = name.toUpperCase()
    const check = await Plan.findOne({name:exist})
    if(check){
        return res.status(400).send({
            message: "Plan is already registered"
        })
    }else{
        let plan = {
            name:exist,
            description:description,
            validityMonth:validityMonth,
            price:price
        }
        const Plandata =await Plan.create(plan)
        res.json({
            message:'success'
        })
    }
}
// const editBrand = async (req, res) => {
//     let id = req.params.id;
//     let brand = req.body.brand;
//     let brandup = brand ? brand.toUpperCase() : undefined;

//     try {
//         if (req.file && req.file.filename) {
//             let filename = req.file.filename;
//             const check = await Brand.findOne({ brand: brandup });
//             if (check && brandup != check.brand) {
//                 return res.status(400).send({
//                     message: "Brand is already registered"
//                 });
//             } else {
//                 const Updated = await Brand.updateOne({ _id: id }, { $set: { brand: brandup, image: filename } });
//                 res.json({
//                     message: "success"
//                 });
//             }
//         } else {

//             const check = await Brand.findOne({ brand: brandup });
//             if (check && brandup != check.brand) {
//                 return res.status(400).send({
//                     message: "Brand is already registered"
//                 });
//             } else {
//                 const Updated = await Brand.updateOne({_id:id},{$set:{brand:brandup}});
//                 res.json({
//                     message: "success"
//                 });
//             }
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: "An error occurred while processing the request"
//         });
//     }
// }
// const brandDetails = async (req,res) => { 
//     try{
//         const GettingBrand  = await Brand.findOne({_id:req.params.id})
//         res.send(GettingBrand)

//     }catch(error){
//         return res.status(401).send({
//             welcome:"UnAuthenticated"
//         })
//     }
// }
const getPlanList = async(req,res) => {
    try{
        console.log("in Plan");
        const PlanList = await Plan.find({})
        console.log(PlanList)
        res.json(PlanList)
    }catch(error){
        console.log(error.message);
    }
}
const activatePlan = async(req,res) => {
 try{
    const token  = req.headers.authorization?.split(" ")[1];
    jwt.verify(token,'TheSecreteKey', async (err, decoded) => {
        if (err) {

            res.status(401).json({
                auth: false,
                status: "failed",
                message: "Failed to authenticate",
            });
        } else {

            const userId = decoded._id;
            const existPlan = await Plan.findOne({user:userId})
            if(existPlan){
                return res.status(401).json({
                    error:'user Have already exist a plan'
                })
            }
            const planData = req.body
            console.log(planData,"whole dta");
            if(planData){
                const currentDate = new Date();
                // Calculate the date 60 days from now
                const expiryDate = new Date(currentDate);
                expiryDate.setDate(currentDate.getDate() + planData.validityMonth*30);
                let subscribe ={
                    userId:userId,
                    planId:planData._id,
                    paymentId:planData.paymentId,
                    paymentStatus:'success',
                    StartDate:currentDate,
                    expiryDate:expiryDate
                }
                const sub = await Subscription.create(subscribe)
                res.json({message:'success'})
            }else{
                return res.status(401).json({
                    status: "failed",
                    message: "Failed to in payment",
                });
            }
           
        }
    });


 }catch(error){
    console.log(error.message);
 }
}



const getPlan = async(req,res) => {
    try{
        console.log("in pLanun");
        const planName = req.params.planId
        console.log(planName);
        const PlanData = await Plan.findOne({name:planName})
        console.log(PlanData,"data");
        if(PlanData){
            res.json(PlanData)
        }else{
            return res.status(401).send({
                error:"Invalid Plan"
            })
        }

    }catch(error){
        console.log(error.message);
    }
}
const getPlanDetails = async(req,res) => { 
    try{
        console.log("get plan personal data");
        const planId = req.params.planId
        const planData = await Plan.findOne({_id:planId})
        console.log(planData,"planData");
        if(planData){
            res.json(planData)
        }
    }catch(error){
        console.log(error.message);
    }

}
const updatePlan =async(req,res) => { 
    try{
        console.log('update ongoing');

        let planId = req.params.planId
        let name = req.body.name
        let nameupper = name.toUpperCase()
        let description = req.body.description
        let price = req.body.price
        let validityMonth = req.body.validityMonth
        const updateplan = await Plan.findOneAndUpdate({_id:planId},{$set:{
            description:description,
            validityMonth:validityMonth,
            price:price,
            name:nameupper
        }},{ new: true })
        console.log(updateplan,'update done');
        if (updateplan){
            res.json({message:'success'})
        }
        

    }catch(error){
        console.log(error.message)
    }
}
const deletePlan = async(req,res) => { 
    try{
        console.log("hello from delete car");
        const deletePlan = await Plan.deleteOne({_id:req.params.planId})
        const PlanData = await Plan.find({})

        res.json(PlanData)

    }catch(error){
        console.log(error.message);
    }
}
const unlistPlan = async(req,res) =>{
    try{
        const plan = await Plan.findOne({_id:req.params.planId})
        if(plan.unList === false){
            const blocked = await Plan.updateOne({_id:req.params.planId},{$set:{unList:true}});
            console.log(blocked,"done");
            const AllPlans = await Plan.find({})
            res.json(AllPlans)

        }else{
            const unBlocked = await Plan.updateOne({_id:req.params.planId},{$set:{unList:false}});
            const AllPlans = await Plan.find({})
            res.json(AllPlans)
        }

    }catch(error){
        console.log(error.message);
    }
}

const checkExist = async(req,res) => { 
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
                const currentDate = new Date();
                const exist = await Subscription.findOne({userId:userId, expiryDate: { $gte: currentDate } }).populate('planId').exec()
                console.log(exist,"plsub");
                if(exist){
                    res.json({
                        subscriptionData:exist,
                        message:'success'
                    })
                }else{
                    res.status(401).json({
                        message:'failed'
                    })
                }
            }
        })

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    // brand,
    createPlan,
    // deleteBrand,
    // editBrand,
    // brandDetails,
    getPlanList,getPlanDetails,updatePlan,deletePlan,
    getPlan,
    activatePlan,
    checkExist,
    unlistPlan

}