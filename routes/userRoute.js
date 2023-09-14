const express  =require('express')
const userRouter = express.Router()
const path = require('path')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mailer= require('../middleware/otpVerification')
const dotenv=require("dotenv")
dotenv.config()
const userController = require('../controller/userController')
const userTokenVerify = require('../middleware/userAuth')
const carController = require('../controller/carController')
const brandController = require('../controller/brandController')
const packagePlanController = require('../controller/packagePlanController')
const brand = require('../model/brand')
const brandImage =require('../middleware/multer')
const expertReviewer = require('../model/expertReviewer')
const reviewController = require('../controller/reviewController')
const authmiddlware=require('../middleware/userAuth')


userRouter.post('/register',userController.postRegister)
userRouter.get('/otpResend/:email',userController.otpResend)
userRouter.post('/otpVerify/:email',userController.otpVerify)
userRouter.post('/login',userController.postLogin)
userRouter.get('/logout',userController.logout)
userRouter.post('/forgetPassword',userController.forgetPasswordUserFind)
userRouter.post('/forgetOptpVerify',userController.forgetOtpVerify)
userRouter.post('/resetPassword/:email',userController.resetPassword)

userRouter.get('/getAllCars',carController.getAllCars)
userRouter.get('/getCars',carController.getCars)
userRouter.get('/popularCars',carController.popularCars)
userRouter.get('/justLaunched',carController.justLuanchedCars)
userRouter.get('/upcommingCars',carController.upcommingCars)
userRouter.get('/geCarDetails/:carId',carController.getCarDetails)

userRouter.get('/getBrands',brandController.getBrandList)
userRouter.get('/getPlans',packagePlanController.getPlanList)
userRouter.post('/planActivate',packagePlanController.activatePlan)
userRouter.get('/checkingPlanExist',packagePlanController.checkExist)

userRouter.post('/updateUser',authmiddlware,userController.updateUser)
userRouter.get('/getSelectedPlan/:planId',authmiddlware,packagePlanController.getPlan)
userRouter.get('/getUserDetails',userController.userDetails)
userRouter.post('/updateProfile',authmiddlware,brandImage.single('image'),userController.updateProfile)

userRouter.get('/getReviewer',userController.getReviewers)
userRouter.get('/createConnection/:reviewerId',authmiddlware,userController.createConnection)
userRouter.get('/findConnection',authmiddlware,userController.findConnection)

userRouter.get('/getStates',userController.getStates)

userRouter.get('/getAllVersions/:carId',carController.getAllVersions)

userRouter.get('/getAllReviews',reviewController.getAllreviews)
userRouter.get('/getSingleReview/:reviewId',reviewController.getSingleReview)

userRouter.get('/getCarsOfBrand/:brandId',brandController.getCarsofBrand)
userRouter.get('/getOtherBrands/:brandId',brandController.getOtherBrands)



// chatting 
userRouter.get('/getChattingReviewer/:connectionId',authmiddlware,userController.getChattingReviewer)
userRouter.post('/sendMessage/:connectionId',authmiddlware,userController.postMessage)
userRouter.get('/getMessages/:connectionId',authmiddlware,userController.getAllMessages)

// Add to whishlist 
userRouter.post('/addToWishlist/:carId',authmiddlware,carController.addtoWishlist)
userRouter.get('/getWishlist',authmiddlware,carController.getWislist)

// getUser id 
userRouter.get('/getUserId',userController.getUserId)
userRouter.get('/getTaxData/:id',userController.getTaxData)

userRouter.get('/getFilterData',userController.getFilterData)
userRouter.get('/carFilter',carController.filterCar)
userRouter.get('/getUniqueBrandsforCompare',carController.uniqueBrandsInComaper)
userRouter.get('/getUniqueCarsforCompare/:brandId',carController.uniqueCarsInComaper)
userRouter.get('/getVersionsforCompare/:carId',carController.versionsInComaper)



module.exports = userRouter