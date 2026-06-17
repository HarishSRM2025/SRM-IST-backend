const DeanMessageModel = require("../../models/institution/deanMessage")

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

const updateDeanMessage = async (req,res)=>{
    try {
        const { institutionId,deanName,message} = req.body;
        let deanImage = req.body.deanImage; // Fallback to existing image if passed
        
        if (req.file) {
            deanImage = req.file.filename;
        }

        const existingMessage = await DeanMessageModel.findOne({ institutionId, _id: { $ne: req.params.id } });
        if (existingMessage) {
            return res.status(400).json({
                success: false,
                message: "A Dean message already exists for this institution."
            });
        }

        const deanMessage = await DeanMessageModel.findByIdAndUpdate(req.params.id,{institutionId,deanName,deanImage,message},{new:true})
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

const deleteDeanMessage = async (req,res)=>{
    try {
        const deanMessage = await DeanMessageModel.findByIdAndDelete(req.params.id)
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

module.exports = {
    createDeanMessage,
    getAllDeanMessages,
    getDeanMessageById,
    updateDeanMessage,
    deleteDeanMessage
}