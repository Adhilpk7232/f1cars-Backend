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



const brand = async(req,res)=>{
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
                const GettingUser = await Brand.find({})
                res.send(GettingUser)
            }
        });
        

    }catch(error){
        return res.status(401).send({
            error:"UnAuthenticated"
        })
    }
}

const deleteBrand = async(req,res) => {
    try{
        await Brand.deleteOne({_id:req.params.id})
        const GettingUser = await Brand.find({})

        res.send(GettingUser)

    }catch(errro){
        return res.status(401).send({
            welcome:"UnAuthenticated"
        })    
    }
}
const createBrand = async (req,res) => {

    let name= req.body.name;
    let image = req.file.filename;
    const exist = name.toUpperCase()
    const check = await CarDealer.findOne({brand:exist})
    if(check){
        return res.status(400).send({
            message: "Brand is already registered"
        })
    }else{
        let brand = {
            brand:exist,
            image:image
        }
        const BrandData =await Brand.create(brand)
        res.json({
            message:'success'
        })
    }
}
const editBrand = async (req, res) => {
    let id = req.params.id;
    let brand = req.body.brand;
    let brandup = brand ? brand.toUpperCase() : undefined;

    try {
        if (req.file && req.file.filename) {
            let filename = req.file.filename;
            const check = await Brand.findOne({ brand: brandup });
            if (check && brandup != check.brand) {
                return res.status(400).send({
                    message: "Brand is already registered"
                });
            } else {
                const Updated = await Brand.updateOne({ _id: id }, { $set: { brand: brandup, image: filename } });
                res.json({
                    message: "success"
                });
            }
        } else {

            const check = await Brand.findOne({ brand: brandup });
            if (check && brandup != check.brand) {
                return res.status(400).send({
                    message: "Brand is already registered"
                });
            } else {
                const Updated = await Brand.updateOne({_id:id},{$set:{brand:brandup}});
                res.json({
                    message: "success"
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "An error occurred while processing the request"
        });
    }
}
const brandDetails = async (req,res) => { 
    try{
        console.log("hello");
        const GettingBrand  = await Brand.findOne({_id:req.params.id})
        console.log(GettingBrand,"from bransd");
        res.json(GettingBrand)

    }catch(error){
        return res.status(401).send({
            welcome:"UnAuthenticated"
        })
    }
}
const unlistBrand = async(req,res) =>{
    try{
        const brand = await Brand.findOne({_id:req.params.brandId})
        if(brand.unList === false){
            const blocked = await Brand.updateOne({_id:req.params.brandId},{$set:{unList:true}});
            console.log(blocked,"done");
            const AllBrands = await Brand.find({})
            res.json(AllBrands)

        }else{
            const unBlocked = await Brand.updateOne({_id:req.params.brandId},{$set:{unList:false}});
            const AllBrands = await Brand.find({})
            res.json(AllBrands)
        }
    }catch(error){
        console.log(error.message);
    }
}
const getBrandList = async(req,res) => {
    try{
        const BrandList = await Brand.find({})
        res.json(BrandList)
    }catch(error){
        console.log(error.message);
    }
}

const getCarsofBrand = async(req,res) => { 
    try{
        const brandId = req.params.brandId
        const Cars = await Car.find({brand:brandId}).populate('brand').exec()
        if(Cars){
            res.json(Cars)
        }else{
            res.json({message:'cars is empty'})
        }

    }catch(error){
        console.log(error.message);
    }
}
const getOtherBrands =async(req,res) =>{
    try{
        const brandId = req.params.brandId
        const otherBrands = await Brand.find({_id:{$ne:brandId}})
        if(otherBrands){
            console.log(otherBrands,"otherBrands");
            res.json(otherBrands)
        }else{
            res.json({message:'otherBrands is empty'})
        }

    }catch(error){
        console.log(error.message);
    }
}
module.exports = {
    brand,
    createBrand,
    deleteBrand,
    editBrand,
    brandDetails,
    getBrandList,
    getCarsofBrand,
    getOtherBrands,
    unlistBrand

}