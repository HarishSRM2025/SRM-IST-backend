const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            file.fieldname +
            "-" +
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10485760 // 10MB
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".pdf",
            ".doc",
            ".docx"
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only images (.png, .jpg, .jpeg, .gif, .webp) and documents (.pdf, .doc, .docx) are allowed."
                )
            );
        }
    }
});


module.exports = upload;