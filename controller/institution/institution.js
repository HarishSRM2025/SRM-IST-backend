const InstitutionModel = require("../../models/institution/institution")

const createIntitution = async (req, res) => {
    try {
        const { name, vision, mission } = req.body
        if (!name || !vision || !mission) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const institution = await InstitutionModel.create({name,vision,mission})
        res.status(201).json({
            success:true,
            data:institution
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const getAllIntitutions = async (req,res)=>{
    try {
        const institutions = await InstitutionModel.find()
        res.status(200).json({
            success:true,
            data:institutions
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const getIntitutionById = async (req,res)=>{
    try {
        const institution = await InstitutionModel.findById(req.params.id)
        res.status(200).json({
            success:true,
            data:institution
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const updateIntitution = async (req,res)=>{
    try {
        const institution = await InstitutionModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json({
            success:true,
            data:institution
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const deleteIntitution = async (req,res)=>{
    try {
        const institution = await InstitutionModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success:true,
            data:institution
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = {
    createIntitution,
    getAllIntitutions,
    getIntitutionById,
    updateIntitution,
    deleteIntitution
}    