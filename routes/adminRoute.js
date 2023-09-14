const express = require('express');
const adminRouter = express.Router()

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Admin = require('../model/admin');
const CarDealer = require('../model/carDealer')
const Brand = require('../model/brand')
const Car = require('../model/car')
const ExpertReviewer = require('../model/expertReviewer');
const carReview = require('../model/carReviewnew')

const brandImage = require('../middleware/multer')
const adminController =require('../controller/adminController')
const brandController  =require('../controller/brandController')
const carController = require('../controller/carController')
const packagePlanController = require('../controller/packagePlanController')
const upload = require('../middleware/excelMulter')

const ExcelJS = require('exceljs');
const authAdminmiddlware=require('../middleware/adminAuth')

// adminRouter.get('/admin',adminController.getAdmin)
adminRouter.get('/otpResend/:adminEmail',adminController.resendOtp)
adminRouter.post('/otpVerify/:email',adminController.otpVerify)
adminRouter.get('/active',adminController.active)
adminRouter.post('/login',adminController.adminLogin)
adminRouter.get('/logout',authAdminmiddlware,adminController.adminLogout)

adminRouter.get('/users',authAdminmiddlware,adminController.usersList)
adminRouter.post('/editUser/:id',authAdminmiddlware,adminController.edituser)
adminRouter.post('/editUserDetails/:id',authAdminmiddlware,adminController.userDeatails)
adminRouter.post('/createUser',authAdminmiddlware,adminController.createUser)
adminRouter.post('/blockUser/:id',authAdminmiddlware,adminController.blockUser)

adminRouter.get('/reviewer',authAdminmiddlware,adminController.reviewer)
adminRouter.post('/deleteReviewer/:id',authAdminmiddlware,adminController.deleteReviewer)
adminRouter.post('/editReviewer/:reviewerId',authAdminmiddlware,adminController.editReviewer)
adminRouter.get('/editReviewerDetails/:id',authAdminmiddlware,adminController.reviewerDeatails)
adminRouter.post('/createReviewer',authAdminmiddlware,adminController.createReviewer)

adminRouter.get('/dealer',authAdminmiddlware,adminController.dealer)
adminRouter.post('/deleteDealer/:id',authAdminmiddlware,adminController.deleteDealer)
adminRouter.post('/editDealer/:dealerId',authAdminmiddlware,adminController.editDealer)
adminRouter.post('/editDealerDetails/:id',authAdminmiddlware,adminController.dealerDetails)
adminRouter.post('/createDealer',authAdminmiddlware,adminController.createDealer)

adminRouter.get('/brand',authAdminmiddlware,brandController.brand)
adminRouter.post('/deleteBrand/:id',authAdminmiddlware,brandController.deleteBrand)
adminRouter.post('/createBrand',authAdminmiddlware,brandImage.single('image'),brandController.createBrand)
adminRouter.post('/editBrand/:id',authAdminmiddlware,brandController.editBrand)
adminRouter.post('/getBrandDetails/:id',authAdminmiddlware,brandController.brandDetails)
adminRouter.get('/unlistBrand/:brandId',authAdminmiddlware,brandController.unlistBrand)

adminRouter.post('/addCar',authAdminmiddlware,brandImage.single('image'),carController.addCar)
adminRouter.get('/car',authAdminmiddlware,carController.allCar)
adminRouter.post('/editCarDetails/:carId',authAdminmiddlware,carController.carDeatails)
adminRouter.post('/updateCar/:carId',authAdminmiddlware,carController.updateCar)
adminRouter.get('/deleteCar/:id',authAdminmiddlware,carController.deleteCar)

adminRouter.post('/addVersion/:CarId',authAdminmiddlware,upload.single('excelSpecification'),carController.addVersion)
adminRouter.get('/getAllVersions/:carId',authAdminmiddlware,carController.getVersions)

adminRouter.get('/carReview',authAdminmiddlware,carController.carReviews)
adminRouter.post('/unlistReview/:id',authAdminmiddlware,carController.unlistCarReview)

adminRouter.get('/getPlans',authAdminmiddlware,packagePlanController.getPlanList)
adminRouter.post('/createPlan',authAdminmiddlware,packagePlanController.createPlan)
adminRouter.get('/getPlanData/:planId',authAdminmiddlware,packagePlanController.getPlanDetails)
adminRouter.post('/updatePlan/:planId',authAdminmiddlware,packagePlanController.updatePlan)
adminRouter.get('/deletePlan/:planId',authAdminmiddlware,packagePlanController.deletePlan)
adminRouter.get('/unlistPlan/:planId',authAdminmiddlware,packagePlanController.unlistPlan)

adminRouter.post('/addtax',authAdminmiddlware,adminController.addTax)
adminRouter.get('/getAllTax',authAdminmiddlware,adminController.getAllTax)
adminRouter.get('/deleteTax/:taxId',authAdminmiddlware,adminController.deleteTax)
adminRouter.post('/upload',authAdminmiddlware,brandImage.single('image'),adminController.uploadImage)
adminRouter.get('/TaxInfo/:taxId',adminController.getTaxInfo)










module.exports = adminRouter;