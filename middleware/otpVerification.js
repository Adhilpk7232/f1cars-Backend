const nodemailer=require("nodemailer")
const dotenv=require("dotenv")
dotenv.config()


module.exports={
    
    mailerTransporter:nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.emailUser,
            pass:process.env.emailPassword
        }
    }),
    // OTP:`${new Date().getTime().toString().substr}`
    OTP:`${Math.floor(1000+Math.random()*9000)}`

    
}