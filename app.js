const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors')
const cookieParese = require('cookie-parser')
const multer = require('multer')
const app = express()
const http = require('http').createServer(app); // Create HTTP server
const intializeSocket = require('./socket.io/socket')
const dotenv = require("dotenv");
const config = require('./config/config')

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb' }));

app.use('/public/brandImages', express.static('public/brandImages'));
app.use('/public/profile', express.static('public/carReviewImages'));

config.mongooseconnection()


// Enable CORS
app.use(cors({
    origin: process.env.origin,
    credentials: true
  }));

app.use(cookieParese())
app.use(express.json())

// mongoose.connect("mongodb://localhost:27017/f1cars", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('Connected to MongoDB');
// })
// .catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });
const userRouter = require('./routes/userRoute')
app.use('/',userRouter)

const adminRouter =require('./routes/adminRoute')
app.use('/admin',adminRouter)

const reviewerRouter = require('./routes/expertRoute')
app.use('/reviewer',reviewerRouter)

// listening 

const PORT = process.env.PORT ;
const server = http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

intializeSocket(server)