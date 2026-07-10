const InfrastructureModel = require("../../models/institution/infrastructure")
const fs = require("fs");
const path = require("path");

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
const updateInfrastructure = async (req, res) => {
    try {
        const {
            institutionId,
            infraName,
            infraDesc,
            equipment,
            capacity
        } = req.body;


        // Get existing infrastructure
        const infrastructure = await InfrastructureModel.findById(req.params.id);

        if (!infrastructure) {
            return res.status(404).json({
                success: false,
                message: "Infrastructure not found"
            });
        }


        let infraImage = infrastructure.infraImage;


        if (req.file) {

            // Delete old image
            if (infrastructure.infraImage) {

                const oldImagePath = path.join(
                    process.cwd(),
                    "public/uploads",
                    infrastructure.infraImage
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }


            infraImage = req.file.filename;
        }


        let equipmentArray = undefined;

        if (equipment) {
            try {
                equipmentArray =
                    typeof equipment === "string"
                        ? JSON.parse(equipment)
                        : equipment;

                if (!Array.isArray(equipmentArray)) {
                    equipmentArray = [equipment];
                }

            } catch (e) {
                equipmentArray = [equipment];
            }
        }


        if (!institutionId || !infraName || !infraDesc) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        const updateData = {
            institutionId,
            infraName,
            infraDesc,
            infraImage
        };


        const unsetData = {};


        if (capacity !== undefined && capacity !== "") {
            updateData.capacity = Number(capacity);
        } else {
            unsetData.capacity = "";
        }


        if (equipmentArray !== undefined) {
            updateData.equipment = equipmentArray;
        }


        const updateOperation = {
            $set: updateData
        };


        if (Object.keys(unsetData).length > 0) {
            updateOperation.$unset = unsetData;
        }


        const updatedInfrastructure =
            await InfrastructureModel.findByIdAndUpdate(
                req.params.id,
                updateOperation,
                { new: true }
            );


        res.status(200).json({
            success: true,
            data: updatedInfrastructure
        });


    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteInfrastructure = async (req, res) => {
    try {

        const infrastructure =
            await InfrastructureModel.findById(req.params.id);


        if (!infrastructure) {
            return res.status(404).json({
                success: false,
                message: "Infrastructure not found"
            });
        }


        // Delete image from public/uploads
        if (infrastructure.infraImage) {

            const imagePath = path.join(
                process.cwd(),
                "public/uploads",
                infrastructure.infraImage
            );


            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }


        // Delete database record
        await InfrastructureModel.findByIdAndDelete(req.params.id);


        res.status(200).json({
            success: true,
            message: "Infrastructure deleted successfully"
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getInfrastructure,
    createInfrastructure,
    updateInfrastructure,
    deleteInfrastructure
}
