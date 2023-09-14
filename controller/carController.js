const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Admin = require('../model/admin');
const CarDealer = require('../model/carDealer')
const Brand = require('../model/brand')
const Car = require('../model/car')
const ExpertReviewer = require('../model/expertReviewer');
const carReview = require('../model/carReviewnew')
const carVarient = require('../model/CarVerient')

const brandImage = require('../middleware/multer');
const ExcelJS = require('exceljs');
const path = require('path')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


const addCar = async(req,res)=> {
    try{

    let image = req.file.filename;

    let carName = req.body.carName
    let description = req.body.description
    let price = req.body.price
    let maileage = req.body.maileage
    let engine = req.body.engine
    let fuelType = req.body.fuelType
    let transmission = req.body.transmission
    let bodyType = req.body.bodyType
    let seatCapacity = req.body.seatCapacity
    let safety = req.body.safety
    let brand = req.body.brand
    let role  = req.body.role
    let Date = req.body.Date
    
    let color = req.body.color
    const colorsArray = JSON.parse(color);

    let car = {
        carName:carName,
        description:description,
        price:price,
        maileage:maileage,
        engine:engine,
        fuelType:fuelType,
        transmission:transmission,
        bodytype:bodyType,
        seatCapacity:seatCapacity,
        safety:safety,
        brand:brand,
        role:role,
        lauchedDate:Date,
        image:image,
        colors: colorsArray
  

    }
    const carData =await Car.create(car)
    res.json({
        message:'success'
    })
    }catch(error){
        console.log(error.message);
    }

}
const allCar = async(req,res)=>{
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
                const GettingCar = await Car.find({})
                res.json(GettingCar)
            }
        });
    }catch(error){
        return res.status(401).send({
            error:"UnAuthenticated"
        })
    }
}
const carDeatails =async(req,res)=> {
    try{
        const GettingCarInfo  = await Car.findOne({_id:req.params.carId})
        res.send(GettingCarInfo)

    }catch(error){
        return res.status(401).send({
            error:"UnAuthenticated"
        })
    }
}
const updateCar = async(req,res) => {
    try{
        const carId = req.params.carId
        const car = req.body
        const updateCar = await Car.updateOne({_id:carId},{$set:{brand:car.brand,
            carName:car.carName,
            description:car.description,
            engine:car.engine,
            fuelType:car.fuelType,
            maileage:car.maileage,
            price:car.price,
            role:car.role,
            safety:car.safety,
            seatCapacity:car.seatCapacity,
            transmission:car.transmission,
            bodytype:car.bodytype,
            lauchedDate:car.date
        }})
        if(updateCar){
            res.json({message:'success'})
        }



// lauchedDate:

    }catch(error){
        console.log(error.message);
    }
}
const deleteCar = async(req,res) => {
    try{
        await Car.deleteOne({_id:req.params.id})
        const CarData = await Car.find({})

        res.send(CarData)

    }catch(errro){
        return res.status(401).send({
            welcome:"UnAuthenticated"
        })    
    }
}

const carReviews = async(req,res) => { 
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
                const GettingCarReviews = await carReview.find().populate('carId reviewerId').exec();
                res.json(GettingCarReviews)
            }
        });
        

    }catch(error){
        return res.status(401).json({
            error:"UnAuthenticated"
        })
    }
}
const unlistCarReview = async(req,res)=>{
    try{
        const review = await carReview.findOne({_id:req.params.id})
        if(review.unlist === false){
            const blocked = await carReview.updateOne({_id:req.params.id},{$set:{unlist:true}});
            console.log(blocked,"done");
            const allReview = await carReview.find().populate('carId reviewerId').exec();
            res.send(allReview)

        }else{
            const unBlocked = await carReview.updateOne({_id:req.params.id},{$set:{unlist:false}});
            const allReview = await carReview.find().populate('carId reviewerId').exec();
            res.send(allReview)
        }
    }catch(error){
        console.log(error.message);
        return res.status(401).send({
            welcome:"UnAuthenticated"
        }) 
    }
}
const getAllCars =async(req,res) => {
    try{
        
        const allCars =await Car.find({}).populate('brand').exec()
        if(allCars){
            res.json(allCars)
        }else{
            res.status(401).json({
                message:'failed',
                error:'fetching cars went wrong'
            })
        }

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getCars =async(req,res) => {
    try{
        console.log("reached here");
        const filters = req.query;
        console.log(filters.page,filters.pageSize,"filters");
        const page = parseInt(filters.page) || 1; // Current page number
        const pageSize = parseInt(filters.pageSize) || 10; // Number of items per page

        // Calculate the number of items to skip
        const skip = (page - 1) * pageSize;
        console.log(skip,"skip");
        const allCars =await Car.find({}).populate('brand').skip(skip).limit(pageSize).exec()
        // Calculate the total number of matching items (without pagination)
        const totalCount = await Car.countDocuments({});
        console.log(totalCount,"total count");
        if(allCars){
            res.json({cars:allCars,
                totalCount: totalCount,})
        }else{
            res.status(401).json({
                message:'failed',
                error:'fetching cars went wrong'
            })
        }

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const popularCars  = async(req,res)=>{
    try{
        const popularCars = await Car.find({role:'popular'}).populate('brand').exec()
        res.json(popularCars)

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const justLuanchedCars  = async(req,res)=>{
    try{
        const justLaunched = await Car.find({role:'justLaunched'}).populate('brand').exec()
        res.json(justLaunched)

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const upcommingCars  = async(req,res)=>{
    try{
        const upcomminCars = await Car.find({role:'upcoming'}).populate('brand').exec()
        res.json(upcomminCars)

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getCarDetails = async(req,res) => {
    try{
        const carId = req.params.carId
        const carData = await Car.findOne({_id:carId}).populate('brand').exec()
        if(carData){
            res.json(carData)
        }else{
            res.status(401).json({
                message:'car fetching failed'
            })
        }
    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getAllVersions = async(req,res) => { 
    try{
        const carId = req.params.carId
        const versionData = 'versionData'
        if(versionData){
            res.json(versionData)
        }else{
            res.status(401).json({
                message:'failed fetchin version details'
            })
        }


    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const addVersion = async(req,res) => {
    try{
        if (!req.file) {
            return res.status(400).json({ error: 'No Excel file provided' });
          }
          const filePath = path.join(__dirname, '../public/excel', req.file.filename);

        const workbook = new ExcelJS.Workbook();

            const excelData = []
            await workbook.xlsx.readFile(filePath)
            
                
                // Assuming the data is in the first worksheet
                const worksheet = workbook.getWorksheet(1);

                
                // Iterate through rows and columns to access the data
                worksheet.eachRow((row, rowNumber) => {
                const rowData = [];
                row.eachCell((cell, colNumber) => {
                    rowData.push(cell.value);
                });
                

                // Process rowData as needed
                // console.log(`Row ${rowNumber}:`, rowData);
                excelData.push({ [`Row${rowNumber}`]:rowData });
                });
                console.log(excelData,"exceldat");
                // console.log(excelData[3].Row5[1],"seperate");
                // for(let i=0;i<excelData.length;i++){
                //         console.log(i,excelData[i]);
                // }
                console.log(excelData[4].Row6[1],"kkkk");
                const EngineTransmission = {
                    Engine:excelData[4].Row6[1],
                    EngineType:excelData[5].Row7[1],
                    FuelType:excelData[6].Row8[1],
                    MaxPower:excelData[7].Row9[1],
                    MaxTorque:excelData[8].Row10[1],
                    Mileage:excelData[9].Row11[1],
                    DrivingRange:excelData[10].Row12[1],
                    Drivetrain:excelData[11].Row13[1],
                    Transmission:excelData[12].Row14[1],
                    EmissionStandard:excelData[13].Row15[1],
                    Others:excelData[14].Row16[1]
                }
                const DimensionsWeight = { 
                    Length:excelData[17].Row20[1],
                    Width:excelData[18].Row21[1],
                    Height:excelData[19].Row22[1],
                    WheelBase:excelData[20].Row23[1],
                    GroundClearance:excelData[21].Row24[1],
                }
    
                const Capacity = {
                    Doors:excelData[24].Row28[1],
                    SeattingCapacity:excelData[25].Row29[1],
                    NoOFseatCapacityRow:excelData[26].Row30[1],
                    BootSpace:excelData[27].Row31[1],
                    FuelTankCapacity:excelData[28].Row32[1],
    
                }
                 
    
                const SuspensionsBrakesSteeringTyres = { 
                    FrontSuspension:excelData[31].Row36[1],
                    RearSuspension:excelData[32].Row37[1],
                    FrontBrakeType:excelData[33].Row38[1],
                    RearBrakeType:excelData[34].Row39[1],
                    MinimumTurningRadius:excelData[35].Row40[1],
                    SteeringType:excelData[36].Row41[1],
                    Wheels:excelData[37].Row42[1],
                    SpareWheel:excelData[38].Row43[1],
                    FrontTyres:excelData[39].Row44[1],
                    RearTyres:excelData[40].Row45[1]
    
                }
                // features 
                
                const Safety = { 
                    OverspeedWarning:excelData[44].Row52[1],
                    Airbags:excelData[45].Row53[1],
                    Middlerearthreepointseatbelt:excelData[46].Row54[1],
                    MiddleRearHeadRest:excelData[47].Row55[1],
                    ChildSeatAnchorPoints:excelData[48].Row56[1],
                    SeatBeltWarning:excelData[49].Row57[1],
      
                }
                const BrakingTraction ={
                    AntiLockBrakingSystem:excelData[52].Row61[1],
                    ElectronicBrakeforceDistribution:excelData[53].Row62[1],
                    BrakeAssist:excelData[54].Row63[1],
                    ElectronicStabilityProgram:excelData[55].Row64[1],
                    HillHoldControl:excelData[56].Row65[1],
                    TractionControlSystem:excelData[57].Row66[1],
    
                }
                const LocksSecurity ={
                    Engineimmobilizer:excelData[60].Row70[1],
                    CentralLocking:excelData[61].Row71[1],
                    SpeedSensingDoorLock:excelData[62].Row72[1],
                    ChildSafetyLock:excelData[63].Row73[1],
                }
                const ComfortConvenience ={
                    AirConditioner:excelData[66].Row77[1],
                    FrontAC:excelData[67].Row78[1],
                    Heater:excelData[68].Row79[1],
                    VanityMirrorsonSunVisors:excelData[69].Row80[1],
                    CabinBootAccess:excelData[70].Row81[1],
                    AntiglareMirrors:excelData[71].Row82[1],
                    ParkingSensors:excelData[72].Row83[1],
                    SteeringAdjustment:excelData[73].Row84[1],
                    PowerOutlets:excelData[74].Row85[1],
                }
                const Telematics ={
                    OverTheAir:excelData[77].Row90[1],
                    
                }
                const SeatsUpholstery = {
                    DriverSeatAdjustment:excelData[80].Row94[1],
                    FrontPassengerSeatAdjustment:excelData[81].Row95[1],
                    RearRowSeatAdjustment:excelData[82].Row96[1],
                    SeatUpholstery:excelData[83].Row97[1],
                    RearPassengerSeatType:excelData[84].Row98[1],
                    Interiors:excelData[85].Row99[1],
                    FoldingRearSeat:excelData[86].Row100[1],
                    SplitReareat:excelData[87].Row101[1],
                    Headrests:excelData[88].Row102[1],
                }
                const Storage ={
                    CupHolders:excelData[91].Row106[1],
                }
                const DoorsWindowsMirrorsWipers ={
                    OutsideRearViewMirrorsColor:excelData[94].Row110[1],
                    PowerWindows:excelData[95].Row111[1],
                    OneTouchDown:excelData[96].Row112[1],
                    OneTouchUp:excelData[97].Row113[1],
                    AdjustableORVM:excelData[98].Row114[1],
                    TurnIndicatorsonORVM:excelData[99].Row115[1],
                    RearDefogger:excelData[100].Row116[1],
                    ExteriorDoorHandles:excelData[101].Row117[1],
                    InteriorDoorHandles:excelData[102].Row118[1],
                    DoorPockets:excelData[103].Row119[1],
                    BootlidOpener:excelData[104].Row120[1],
                }
                const Exterior ={
                    RoofMountedAntenna:excelData[107].Row124[1],
                    ChromeFinishExhaustpipe:excelData[108].Row125[1],
                }
                const Lighting ={
                    Headlights:excelData[111].Row129[1],
                    TailLights:excelData[112].Row130[1],
                    CabinLamps:excelData[113].Row131[1],
                    RearReadingLamp:excelData[114].Row132[1],
                    HeadlightHeightAdjuster:excelData[115].Row133[1],
                }
                const Instrumentation ={ 
                    InstrumentCluster:excelData[118].Row137[1],
                    TripMeter:excelData[119].Row138[1],
                    AverageFuelConsumption:excelData[120].Row139[1],
                    DistancetoEmpty:excelData[121].Row140[1],
                    Clock:excelData[122].Row141[1],
                    DoorAjarWarning:excelData[123].Row142[1],
                    AdjustableClusterBrightness:excelData[124].Row143[1],
                    ShiftIndicator:excelData[125].Row144[1],
                    Tachometer:excelData[126].Row145[1],
                }
                const EntertainmentInformationCommunication = { 
                    SmartConnectivity:excelData[129].Row149[1],
                    Display:excelData[130].Row150[1],
                    TouchScreenSize:excelData[131].Row151[1],
                    IntegratedMusicSystem:excelData[132].Row152[1],
                    Speakers:excelData[133].Row153[1],
                    Steeringmountedcontrols:excelData[134].Row154[1],
                    VoiceCommand:excelData[135].Row155[1],
                    BluetoothCompatibility:excelData[136].Row156[1],
                    AuxCompatibility:excelData[137].Row157[1],
                    AMFMRadio:excelData[138].Row158[1],
                    USBCompatibility:excelData[139].Row159[1],
                }
                const ManufacturerWarranty = { 
                    BatteryWarranty:excelData[142].Row163[1],
                }
                const carId = req.params.CarId
                const version = req.body
                console.log(DimensionsWeight,"DimensionsWeight");
                console.log(EngineTransmission,"EngineTransmission");
                let versionData = new carVarient({
                        carId:carId,
                        version:version.version,
                        colors:version.color,
                        price:version.price,
                        fuelType:version.fuelType,
                        transmission:version.transmission,
                        Specification:{
                            EngineTransmission:EngineTransmission,
                            DimensionsWeight:DimensionsWeight,
                            Capacity:Capacity,
                            SuspensionsBrakesSteeringTyres:SuspensionsBrakesSteeringTyres
                        },
                        Features:{
                            Safety:Safety,
                            BrakingTraction:BrakingTraction,
                            LocksSecurity:LocksSecurity,
                            ComfortConvenience:ComfortConvenience,
                            Telematics:Telematics,
                            SeatsUpholstery:SeatsUpholstery,
                            Storage:Storage,
                            DoorsWindowsMirrorsWipers:DoorsWindowsMirrorsWipers,
                            Lighting:Lighting,
                            Exterior:Exterior,
                            Instrumentation:Instrumentation,
                            EntertainmentInformationCommunication:EntertainmentInformationCommunication,
                            ManufacturerWarranty:ManufacturerWarranty
                        }
    
                    })
                    console.log(versionData.Specification[0],"data");
                    console.log(versionData.Features[0],"version");
                if(versionData){
                    const insertVersion = await versionData.save()
                        if(insertVersion){
                            res.json({message:'success'})
                        }
                }else{
                    console.log("not complerte");
                }
                
    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getVersions = async(req,res) =>{
    try{
        const carId = req.params.carId
        const versions = await carVarient.find({carId:carId}).populate('carId').exec()
        res.json(versions)

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const addtoWishlist =async(req,res) => {

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
                const CarId = req.params.carId
                let exist =await User.findOne({_id:userId,'wishlist.car':CarId})
                if(exist){
                    const result = await User.updateOne({_id:userId},{$pull: { wishlist: { car: CarId } } });
                    return res.json({
                        message:'success',
                        action:'remove'
                    })

                }else{
                    const carData = await Car.findOne({_id:CarId})        
                    const userData = await User.findOne({_id:userId})
                    const result = await User.updateOne({_id:userId},{$push:{wishlist:{car:CarId}}})
                    if(result){
                    console.log(result,"item ADDed");

                        res.json({
                            message:'success',
                            action:'add'
                            })
                    }else{
                        console.log('not addeed to cart');
                    }
                }
                    
            }
        });
        
        
        
    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const getWislist = async(req,res) => { 
    try{
        const token = req.headers.authorization?.split(" ")[1];
        jwt.verify(token,'TheSecreteKey',async(err,decoded)=>{
            if(err){
                res.status(401).json({
                    auth: false,
                    status: "failed",
                    message: "Failed to authenticate",
                });
            }else{
                const userId = decoded._id
                const userData = await User.findOne({_id:userId}).populate('wishlist.car').exec()
                res.json(userData)
            }

        })
    }catch(error){
        console.log(error.message);
    }
}
const filterCar = async (req, res) => {
    try {
        // console.log("inside filter");
        const filters = req.query;
        const page = parseInt(filters.page) || 1; // Current page number
        const pageSize = parseInt(filters.pageSize) || 10; // Number of items per page

        // Calculate the number of items to skip
        const skip = (page - 1) * pageSize;
        // console.log(filters, "got params filter");

        // Construct the MongoDB query based on the provided filters
        const query = {};

        if (filters.minPrice && filters.maxPrice) {
            query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
        }

        if (filters.bodyType) {
            if(filters.bodyType.length >1){

                const bodyTypeValues = filters.bodyType.split(',');
            // Use $in operator to match any of the specified values
            query.bodytype = { $in: bodyTypeValues };
            }else{
                query.bodytype = filters.bodyType;
            }
            
        }

        if (filters.fuelType) {
            if(filters.fuelType.length >1){
                const fuelValues = filters.fuelType.split(',');
            // Use $in operator to match any of the specified values
            query.fuelType = { $in: fuelValues };
            }else{
                query.fuelType = filters.fuelType;
            }
            

            
        }

        if (filters.transmission) {
            if(filters.transmission.length>1){
                // Split the comma-separated values into an array
            const transmissionValues = filters.transmission.split(',');
            // Use $in operator to match any of the specified values
            query.transmission = { $in: transmissionValues };
            }else{
                query.transmission = filters.transmission;
            }
            
        }

        if (filters.seatCapacity) {
            if(filters.seatCapacity.length >1){

                const seatCapacityeValues = filters.seatCapacity.split(',');
            // Use $in operator to match any of the specified values
            query.seatCapacity = { $in: seatCapacityeValues };
            }else{
                query.seatCapacity = filters.seatCapacity;
            }
            
        }
        
        // Handle sorting
        let sort = 'asc'; // Default to ascending order
        if (filters.sort) {
            sort = filters.sort.toLowerCase(); // Get the sorting order from the query parameters
        }

        // Use the constructed query and sorting to filter and sort data
        const sortOptions = {};
        if (sort === 'desc') {
            sortOptions.price = -1; // Sort by price in descending order
        } else {
            sortOptions.price = 1; // Sort by price in ascending order (default)
        }

        // Use the constructed query to filter data
        const cars = await Car.find(query).skip(skip) // Skip the first "skip" number of items
        .limit(pageSize) // Limit the number of items per page
        .sort(sortOptions) // Sorting options
        .exec();

        // Calculate the total number of matching items (without pagination)
        const totalCount = await Car.countDocuments(query);

        // console.log(cars, "got response filter");
        res.json({
            cars: cars,
            totalCount: totalCount,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const uniqueBrandsInComaper = async(req,res) =>{
    try{
        const mongoose = require('mongoose');
        const { ObjectId } = mongoose.Types; // Import ObjectId from mongoose.Types
        
        const carVerient = await carVarient.find({}).populate('carId').exec();
        console.log(carVerient);
        
        let brands = [];
        carVerient.forEach((verient) => {
          brands.push(verient.carId.brand);
        });
        
        console.log('Brand:', brands);
        
        // Your array with duplicate ObjectIds
        const arrayWithDuplicates = [
          new ObjectId("64c0a040867bda29cfcb7fbe"),
          new ObjectId("64c09a24867bda29cfcb7f71"),
          new ObjectId("64c09a33867bda29cfcb7f76"),
          new ObjectId("64c09a24867bda29cfcb7f71"),
          new ObjectId("64c09a55867bda29cfcb7f7b"),
          new ObjectId("64c09a55867bda29cfcb7f7b")
        ];
        
        // Create a Set from the array to automatically remove duplicates
        const uniqueArray = [...new Set(brands)];
        
        console.log(uniqueArray, "remove duplicate");
        
        const finedBrands = await Brand.find({ _id: { $in: uniqueArray } });
        console.log(finedBrands, "uni brands");
        
        res.json(finedBrands);
        
    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const uniqueCarsInComaper = async(req,res) =>{
    try{
        const brandId = req.params.brandId
        console.log(brandId,"reqparmas ");
        const query = { 'carId.brand': brandId };
        // const Cars = await carVarient.find(query).populate('carId').exec()
        const Cars = await carVarient.find()
        .populate({
            path: 'carId',
            match: { brand: brandId }, // Filter by brandId
            select: 'brand carName image' ,// Select only the 'brand' field from the referenced Car model
        })
        .exec();
        console.log(Cars,"car selsetion cars for compare");
        res.json(Cars)

    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const versionsInComaper =async(req,res) =>{
    try{
        console.log(req.params.carId,"carId in versions");
        const carId = new ObjectId(req.params.carId)
        
        const version = await carVarient.find({carId:carId}).populate('carId').exec()
        res.json(version)

    }catch(error){
        console.log(error.message);
    }
}
module.exports = {
    addCar,allCar,carDeatails,
    carReviews,unlistCarReview,popularCars,
    upcommingCars,justLuanchedCars,updateCar,
    deleteCar,getCarDetails,getAllVersions,
    addVersion,addtoWishlist,getWislist,
    getVersions,
    getAllCars,
    filterCar,
    getCars,
    uniqueBrandsInComaper,
    uniqueCarsInComaper,
    versionsInComaper
}