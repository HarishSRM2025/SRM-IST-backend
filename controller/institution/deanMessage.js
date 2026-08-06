const fs = require("fs");
const path = require("path");
const DeanMessageModel = require("../../models/institution/deanMessage")
const imagePath = path.join(
    process.cwd(),
    "public/uploads"
);


const createDeanMessage = async (req,res)=>{
    try {
        const {institutionId,deanName,message} = req.body
        const deanImage = req.file ? req.file.filename : null;

        if(!institutionId || !deanName || !deanImage || !message){
            return res.status(400).json({
                success:false,
                message:"All fields are required. Please ensure you upload an image."
            })
        }

        const existingMessage = await DeanMessageModel.findOne({ institutionId })
        if (existingMessage) {
            return res.status(400).json({
                success: false,
                message: "A Dean message already exists for this institution."
            })
        }

        const deanMessage = await DeanMessageModel.create({institutionId,deanName,deanImage,message})
        res.status(201).json({
            success:true,
            data:deanMessage
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const getAllDeanMessages = async (req,res)=>{
    try {
        const deanMessages = await DeanMessageModel.find()
        res.status(200).json({
            success:true,
            data:deanMessages
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const getDeanMessageById = async (req,res)=>{
    try {
        const deanMessage = await DeanMessageModel.findById(req.params.id)
        res.status(200).json({
            success:true,
            data:deanMessage
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const updateDeanMessage = async (req, res) => {
    try {
        const { institutionId, deanName, message } = req.body;

        // Find existing dean message
        const oldDeanMessage = await DeanMessageModel.findById(req.params.id);

        if (!oldDeanMessage) {
            return res.status(404).json({
                success: false,
                message: "Dean message not found"
            });
        }

        let deanImage = oldDeanMessage.deanImage; // Keep old image

        // If new image uploaded
        if (req.file) {
            deanImage = req.file.filename;

            // Delete old image
            if (oldDeanMessage.deanImage) {
                const oldImagePath = path.join(
                    imagePath,
                    oldDeanMessage.deanImage
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Check duplicate institution
        const existingMessage = await DeanMessageModel.findOne({
            institutionId,
            _id: { $ne: req.params.id }
        });

        if (existingMessage) {
            return res.status(400).json({
                success: false,
                message: "A Dean message already exists for this institution."
            });
        }

        const deanMessage = await DeanMessageModel.findByIdAndUpdate(
            req.params.id,
            {
                institutionId,
                deanName,
                deanImage,
                message
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: deanMessage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const deleteDeanMessage = async (req, res) => {
    try {
        // Find existing dean message
        const deanMessage = await DeanMessageModel.findById(req.params.id);

        if (!deanMessage) {
            return res.status(404).json({
                success: false,
                message: "Dean message not found"
            });
        }

        // Delete image from storage
        if (deanMessage.deanImage) {
            const filePath = path.join(
                imagePath,
                deanMessage.deanImage
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete database record
        await DeanMessageModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Dean message deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
};

module.exports = {
    createDeanMessage,
    getAllDeanMessages,
    getDeanMessageById,
    updateDeanMessage,
    deleteDeanMessage
}