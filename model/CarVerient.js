const mongoose = require('mongoose')

const EngineTransmissionSchema = new mongoose.Schema({
    // EngineTransmission:{
        Engine: String,
        EngineType: String,
        FuelTye:String,
        MaxPower:String,
        MaxTorque:String,
        Mileage:String,
        DrivingRange:String,
        Drivetrain:String,
        Transmission:String,
        EmissionStandard:String,
        Others:String
    // }
    
    
});
const DimensionsWeightSchema = new mongoose.Schema({
    // DimensionsWeight:{
        Length:Number,
        Width:Number,
        Height:Number,
        WheelBase:Number,
        GroundClearance:Number,
    // }
    
});
const CapacitySchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // Capacity:{
        Doors:Number,
        SeattingCapacity:Number,
        NoOFseatCapacityRow:Number,
        BootSpace:Number,
        FuelTankCapacity:Number,
    // }
   

    // ... other fields
});
const SuspensionsBrakesSteeringTyresSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // SuspensionsBrakesSteeringTyres:{
        FrontSuspension: String,
        RearSuspension: String,
        FrontBrakeType: String,
        RearBrakeType: String,
        MinimumTurningRadius: Number,
        SpareWheel: String,
        FrontTyres: String,
        RearTyres: String,
    // }
    


    // ... other fields
});
const SafetySchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // Safety:{
        OverspeedWarning: String,
        Airbags: String,
        Middlerearthreepointseatbelt: String,
        MiddleRearHeadRest: String,
        ChildSeatAnchorPoints: String,
        SeatBeltWarning: String,
    // }
    


    // ... other fields
});
const BrakingTractionSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // BrakingTraction:{
        AntiLockBrakingSystem: String,
        ElectronicBrakeforceDistribution: String,
        BrakeAssist: String,
        ElectronicStabilityProgram: String,
        HillHoldControl: String,
        TractionControlSystem: String,
    // }
  


    // ... other fields
});
const LocksSecuritySchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // LocksSecurity:{
        Engineimmobilizer: String,
        CentralLocking: String,
        SpeedSensingDoorLock: String,
        ChildSafetyLock: String,
    // }
   


    // ... other fields
});
const ComfortConvenienceSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // ComfortConvenience:{
        AirConditioner: String,
        FrontAC: String,
        Heater: String,
        VanityMirrorsonSunVisors: String,
        CabinBootAccess: String,
        AntiglareMirrors: String,
        ParkingSensors: String,
        SteeringAdjustment: String,
        PowerOutlets:String
    // }
   


    // ... other fields
});
const TelematicsSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // Telematics:{
        OverTheAir: String,
    // }
    


    // ... other fields
});
const SeatsUpholsterySchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // SeatsUpholstery:{
        DriverSeatAdjustment: String,
        FrontPassengerSeatAdjustment: String,
        RearRowSeatAdjustment: String,
        SeatUpholstery: String,
        Interiors: String,
        FoldingRearSeat: String,
        SplitReareat: String,
        Headrests: String,
    
    // }
   

    // ... other fields
});
const StorageSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // Storage:{
        CupHolders: String,
    // }
    



    // ... other fields
});
const DoorsWindowsMirrorsWipersSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // DoorsWindowsMirrorsWipers:{
        OutsideRearViewMirrorsColor: String,
        PowerWindows: String,
        OneTouchDown: String,
        OneTouchUp: String,
        AdjustableORVM:String,
        TurnIndicatorsonORVM: String,
        RearDefogger: String,
        ExteriorDoorHandles: String,
        InteriorDoorHandles: String,
        DoorPockets: String,
        BootlidOpener: String,
    // }
   


    // ... other fields
});
const LightingSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // Lighting:{
        Headlights: String,
        TailLights: String,
        CabinLamps: String,
        RearReadingLamp: String,
        HeadlightHeightAdjuster: String,
    // }
   


    // ... other fields
});
const ExteriorSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // Exterior:{
        RoofMountedAntenna: String,
        ChromeFinishExhaustpipe: String,
    // }
  

    // ... other fields
});
const InstrumentationSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // Instrumentation:{
        InstrumentCluster: String,
        TripMeter: String,
        AverageFuelConsumption: String,
        DistancetoEmpty: String,
        Clock: String,
        DoorAjarWarning: String,
        AdjustableClusterBrightness: String,
        ShiftIndicator: String,
        Tachometer:String
    // }
    


    // ... other fields
});
const EntertainmentInformationCommunicationSchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // EntertainmentInformationCommunication:{
        SmartConnectivity: String,
        Display: String,
        TouchScreenSize: String,
        IntegratedMusicSystem: String,
        Speakers: String,
        Steeringmountedcontrols: String,
        VoiceCommand: String,
        BluetoothCompatibility: String,
        AuxCompatibility: String,
        AMFMRadio: String,
        USBCompatibility: String,
    // }
   


    // ... other fields
});
const ManufacturerWarrantySchema = new mongoose.Schema({
    // Define fields for DimensionsWeight sub-schema
    // ManufacturerWarranty:{
        BatteryWarranty: String,
    // }
    


    // ... other fields
});

const carVarientSchema = new mongoose.Schema({
    carId:{
        type:mongoose.Types.ObjectId,
        ref: 'Car', // Reference to the Car model
        required:true
    },
    version:{
        type:String,
        required:true
    },
    colors:[{
        type:String,
        required:true
    }],
    fuelType:[{
        type:String,
        required:true
    }],
    transmission:[{
        type:String,
        required:true
    }],
    price:{
        type:Number,
        required:true
    },
    Specification:{
        EngineTransmission:EngineTransmissionSchema,
        DimensionsWeight:DimensionsWeightSchema,
        Capacity:CapacitySchema,
        SuspensionsBrakesSteeringTyres:SuspensionsBrakesSteeringTyresSchema},
    Features:{
        ManufacturerWarranty:ManufacturerWarrantySchema,
        EntertainmentInformationCommunication:EntertainmentInformationCommunicationSchema,
        Instrumentation:InstrumentationSchema,
        Exterior:ExteriorSchema,
        Lighting:LightingSchema,
        DoorsWindowsMirrorsWipers:DoorsWindowsMirrorsWipersSchema,
        Storage:StorageSchema,
        SeatsUpholstery:SeatsUpholsterySchema,
        Telematics:TelematicsSchema,
        ComfortConvenience:ComfortConvenienceSchema,
        LocksSecurity:LocksSecuritySchema,
        BrakingTraction:BrakingTractionSchema,
        Safety:SafetySchema
    }
})






module.exports = mongoose.model('carVarient',carVarientSchema)