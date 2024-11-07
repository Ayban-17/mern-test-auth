import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJwtTokenAndSetCookie } from "../utils/generateJwtTokenAndCookie.js"
import { sendVerificationEmail, sendWelcomeEmail, sendForgotPasswordEmail, sendResetPasswordEmail } from "../mailtrap/emails.js";

export const signup = async (req,res) => {
    try {
        const {email, password, name} = req.body;

        if(!email || !password || !name){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
    
        const userAlreadyExists = await User.findOne({email});
    
        if(userAlreadyExists){
            return res.status(400).json({success:false, message: "User with that email already exists"});
        }
    
        const hashedPassword = await bcryptjs.hash(password, 10);

        const verificationToken = generateVerificationToken();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 
        })

        await user.save();

        const {password: _, ...userWithoutPassword } = user._doc;

        generateJwtTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "Successfully Created an Account",
            user: userWithoutPassword
        })
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
        
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })

        if(!user){
            return res.status(400).json({success:false, message:"Invalid Verification code Or Expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        res.status(200).json({success:true, message:"Email Successfully Verified"});
        await sendWelcomeEmail(user.email, user.name)
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({success:false, message:"invalid credentials"});

        const isPasswordMatch = await bcryptjs.compare(password, user.password);

        if(!isPasswordMatch) return res.status(400).json({success:false, message:"invalid credentials"});

        generateJwtTokenAndSetCookie(res, user._id);

        user.lastlogin = new Date();

        await user.save();
        const {password:_, ...userWithoutPassword} = user._doc;
        res.status(200).json({success:true, message:"Login Successfuly", user: userWithoutPassword})

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

export const logout = async (req,res) => {
    res.clearCookie("AuthToken");
    res.status(200).json({success:true, message:"Logged out successfully"})
}

export const forgotPassword = async (req, res) =>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpriesAt = resetTokenExpiresAt;
        await user.save();

        await sendForgotPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success:true, message:`if ${user.email} exist then you will receive an email in a bit`})
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

export const resetPassword = async (req, res) =>{

    try {
        const {resetToken} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpriesAt: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({success:false, message:"Invalid Reset Token or Expired Reset Token"})
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpriesAt = undefined;

        await user.save();

        await sendResetPasswordEmail(user.email);
        res.status(200).json({success: true, message:"Successfully Reset Password"});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

export const checkAuth = async (req, res) =>{
    try {
        const user = await User.findById(req.userID).select("-password");

        if(!user){
            return res.status(401).json({success:false, message:"No User Found"})
        }

        res.status(200).json({success:true, user});
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}