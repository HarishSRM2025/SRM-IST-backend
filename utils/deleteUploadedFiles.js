const fs = require('fs');
const path = require('path');

const deleteUploadedFiles = (...values) => {
    const uploadRoot = path.resolve(process.cwd(), "public", "uploads");

    values.forEach((value) => {
        const filePath = path.join(uploadRoot, value);

        console.log("Upload Root:", uploadRoot);
        console.log("Trying to delete:", filePath);
        console.log("Exists:", fs.existsSync(filePath));

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Deleted:", filePath);
        }
    });
};
module.exports = deleteUploadedFiles;
