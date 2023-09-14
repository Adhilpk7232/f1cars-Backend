const express = require('express');
const reviewerRouter = express.Router()

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Admin = require('../model/admin');
const CarDealer = require('../model/carDealer')
const Brand = require('../model/brand')
const Car = require('../model/car')
const ExpertReviewer = require('../model/expertReviewer');


const upload = require('../middleware/multer')
const carReviewImage = require('../middleware/multer')

const reviewController = require('../controller/reviewController')
const authReviewermiddlware=require('../middleware/reviewerAuth')


reviewerRouter.get('/active',reviewController.active)
reviewerRouter.post('/login',reviewController.postLogin)
reviewerRouter.post('/logout',authReviewermiddlware,reviewController.logOut)

reviewerRouter.get('/getReviewDetails/:id',authReviewermiddlware,reviewController.getReviewDetails)
reviewerRouter.post('/updateReview/:id',authReviewermiddlware,reviewController.updateReview)
reviewerRouter.get('/getReviewerId',authReviewermiddlware,reviewController.getReviewerId)

reviewerRouter.get('/findConnection',authReviewermiddlware,reviewController.findConnection)
reviewerRouter.get('/getMessages/:connectionId',authReviewermiddlware,reviewController.getMessages)
reviewerRouter.get('/getChattingReviewer/:connectionId',authReviewermiddlware,reviewController.getChattingReviewer)
reviewerRouter.post('/sendMessage/:connectionId',authReviewermiddlware,reviewController.postMessage)


reviewerRouter.get('/reviewer',authReviewermiddlware,reviewController.IsReviewer)

reviewerRouter.get('/brand',authReviewermiddlware,reviewController.getBrand)
reviewerRouter.get('/cars/:id',authReviewermiddlware,reviewController.getSingleCar)
reviewerRouter.post('/addReview',authReviewermiddlware,carReviewImage.single('image'),reviewController.postAddReview)
reviewerRouter.get('/carReview',authReviewermiddlware,reviewController.getCarReview)

module.exports =reviewerRouter;