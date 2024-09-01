import {Company} from "../models/company.model.js";

export const registerCompany = async(req,res) => {
    try{
        const {name,description,website,location} = req.body;

        if(!name || !description || !website || !location)
        {
            return res.status(400).json({
                message: "Something is missing",
                success:false
            });
        }

        let company = await Company.findOne({name:name});

        if(company)
        {
            return res.status(400).json({
                message:"You can't register the same company twice",
                success:false
            });
        }

        company = await Company.create({
            name:companyName,
            description: description,
            website: website,
            location: location,
            userId:req.id
        });

        return res.status(200).json({
            message:"Company registered successfully",
            company,
            success:true
        });
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getCompany = async(req,res) => {
    try{
        const userId = req.id;
        const companies = await Company.find({userId});

        if(!companies)
        {
            return res.status(404).json({
                message:"Companies not found",
                success:false
            });
        }

        return res.status(200).json({
            message:"Company found",
            companies,
            success:false
        });
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getCompanyById = async(req,res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if(!company)
        {
            return res.status(404).json({
                message:"Company not found",
                success:false
            });
        }

        return res.status(200).json({
            company,
            success:true
        })

    }
    catch(error)
    {
        console.log(error);
    }
}

export const updateCompany = async (req,res) => {
    try{
        const {name,description,website,location} = req.body;
        const file = req.file;

        const updateData = {name,description,website,location};

        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});

        if(!company)
        {
            return res.status(404).json({
                message:"Company not found",
                success:true
            });
        }

        return res.status(200).json({
            message:"Company information updated",
            success:true
        });
    }
    catch(error)
    {
        console.log(error);
    }
}