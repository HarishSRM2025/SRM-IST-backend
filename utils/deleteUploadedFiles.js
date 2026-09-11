const fs = require("fs");
const path = require("path");

const deleteUploadedFiles = (...values) => {
    const uploadRoot = path.resolve(process.cwd(), "public", "uploads");

    values.forEach((value) => {
        if (!value) return;

        const fileName = path.basename(value);
        const filePath = path.join(uploadRoot, fileName);

        console.log("Trying to delete:", filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Deleted:", filePath);
        }
    });
};

module.exports = deleteUploadedFiles;