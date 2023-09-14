const multer = require('multer');
const path = require('path');

// Set storage and file naming options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'../public/excel'));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${Date.now()}${extname}`);
  }
});

// Filter only Excel files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed'), false);
  }
};

// Create multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB file size limit
  }
});

module.exports = upload;
