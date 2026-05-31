const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Ensure the uploads directory exists before trying to save to it
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        // Sanitize the filename to remove spaces and special characters
        const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${name}_${Date.now()}${ext}`);
    },
});

// 2. Strict file filter (Only PDFs)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// 3. Apply the storage, filter, and a 5MB size limit
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter
});

module.exports = upload;