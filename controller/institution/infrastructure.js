const InfrastructureModel = require("../../models/institution/infrastructure")


const getInfrastructure = async (req,res)=>{
    try {
        const infrastructure = await InfrastructureModel.find()
        res.status(200).json({
            success:true,
            data:infrastructure
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const createInfrastructure = async (req,res)=>{
    try {
        const {institutionId,infraName,infraDesc,equipment,capacity} = req.body
        const infraImage = req.file ? req.file.filename : null;

        let equipmentArray = [];
        try {
            if (equipment) {
                equipmentArray = typeof equipment === 'string' ? JSON.parse(equipment) : equipment;
                if (!Array.isArray(equipmentArray)) equipmentArray = [equipment];
            }
        } catch(e) {
            equipmentArray = [equipment];
        }

        if(!institutionId || !infraName || !infraDesc || !infraImage){
            return res.status(400).json({
                success:false,
                message:"All required fields must be provided, including an image."
            })
        }
        const createData = {
            institutionId,
            infraName,
            infraDesc,
            infraImage,
            equipment: equipmentArray
        };
        if (capacity !== undefined && capacity !== '') {
            createData.capacity = Number(capacity);
        }

        const infrastructure = await InfrastructureModel.create(createData)
        res.status(200).json({
            success:true,
            data:infrastructure
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const updateInfrastructure = async (req,res)=>{
    try {
        const {institutionId,infraName,infraDesc,equipment,capacity} = req.body
        let infraImage = req.body.infraImage;
        if (req.file) {
            infraImage = req.file.filename;
        }

        let equipmentArray = undefined;
        if (equipment) {
            try {
                equipmentArray = typeof equipment === 'string' ? JSON.parse(equipment) : equipment;
                if (!Array.isArray(equipmentArray)) equipmentArray = [equipment];
            } catch(e) {
                equipmentArray = [equipment];
            }
        }

        if(!institutionId || !infraName || !infraDesc){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        
        const updateData = { institutionId, infraName, infraDesc };
        const unsetData = {};
        if (capacity !== undefined && capacity !== '') {
            updateData.capacity = Number(capacity);
        } else {
            unsetData.capacity = "";
        }
        if (infraImage) updateData.infraImage = infraImage;
        if (equipmentArray !== undefined) updateData.equipment = equipmentArray;

        const updateOperation = { $set: updateData };
        if (Object.keys(unsetData).length > 0) {
            updateOperation.$unset = unsetData;
        }

        const infrastructure = await InfrastructureModel.findByIdAndUpdate(
            req.params.id,
            updateOperation,
            { new: true }
        );
        res.status(200).json({
            success:true,
            data:infrastructure
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const deleteInfrastructure = async (req,res)=>{
    try {
        const infrastructure = await InfrastructureModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success:true,
            data:infrastructure
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

module.exports = {
    getInfrastructure,
    createInfrastructure,
    updateInfrastructure,
    deleteInfrastructure
}
