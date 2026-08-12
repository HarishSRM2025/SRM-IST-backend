const fs = require('fs');
const path = require('path');

// Accepts filenames or stored paths and safely removes multer uploads.
const deleteUploadedFiles = (...values) => {
    const uploadRoot = path.resolve(process.cwd(), 'public', 'uploads');
    values.flat(Infinity).filter((value) => typeof value === 'string' && value.trim()).forEach((value) => {
        const filePath = path.resolve(uploadRoot, path.basename(value.replace(/\\/g, '/')));
        if (filePath.startsWith(`${uploadRoot}${path.sep}`) && fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (error) { console.error(error.message); }
        }
    });
};

module.exports = deleteUploadedFiles;
