import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async ( req, res ) => {
    try {
        const {fullname,email,phone,password,role} = req.body;

        if(!fullname || !email || !phone || !password || !role)
        {
            console.log(req.body);
            return res.status(400).json({
                message: "Something is missing",
                success:false
            });
        }

        const user = await User.findOne({email});

        if(user)
        {
            return res.status(400).json({
                message:"User already exists with this email",
                success:false
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.create({
            fullname,
            email,
            phone,
            password:hashedPassword,
            role,
        });

        return res.status(200).json({
            message:"Account created successfully",
            success: true,
        });
    } 
    catch(error)
    {
        console.log(error);
    }
}

export const login = async (req,res) => {
    try {
        const {email,password,role} = req.body;

        if(!email || !password || !role )
        {
            return res.status(400).json({
                message: "Something is missing",
                success:false
            });
        }

        let user = await User.findOne({email});

        if(!user)
        {
            return res.status(400).json({
                message:"Incorrect username",
                success: false,
            });
        }

        const isPasswordMatching = await bcrypt.compare(password,user.password);

        if(!isPasswordMatching)
        {
            return res.status(400).json({
                message:"Incorrect password",
                success:false
            });
        }

        if(role != user.role)
        {
            return res.status(400).json({
                message:"Account doesn't exist with current role",
                success:false
            });
        }

        const tokenData = {
            userId: user._id,
        }

        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email:user.email,
            phone:user.phone,
            role: user.role,
            proile: user.profile,
        };


        return res.status(200).cookie("token",token, {maxAge:1*24*60*60*1000, httpOnly:true , sameSite:'strict'}).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success: true,
        });
    } 
    catch(error)
    {
        console.log(error);
    }
}

export const logout = async (req,res) => {
    try 
    {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            success:true,
        });
    }
    catch(error)
    {
        console.log(error);
    }
}

export const updateProfile = async(req,res) => {
    try {
        const {fullname,email,phone,bio,skills} = req.body;
        const file = req.file;

        if(skills)
        {
            const skillsArray = skills.split(",");
        }

        const userId = req.id;

        let user = await User.findById(userId);

        if(!user)
        {
            return res.status(400).json({
                message:"User not found",
                success:false
            });
        }

        // Update Profile
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phone) user.phone = phone;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email:user.email,
            phone:user.phone,
            role: user.role,
            proile: user.profile,
        };

        return res.status(200).json({
            message:"Profle updated successfully",
            user,
            success: true,
        });
    }
    catch(error)
    {
        console.log(error);
    }
}