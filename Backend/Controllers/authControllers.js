import { User } from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenandSetCookie } from "../Utils/generateTokenSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail,sendResetSuccessEmail } from "../MailTrap/emails.js";
import crypto from "crypto";

export const signup = async (req, res) => {
    const { email, password, name } = req.body ; 
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email}); 
        if(userAlreadyExists){
            return res.status(400).json({
                success : false , 
                message: "User Already Exists"
            }); 
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
    
        const verificationToken = Math.floor(100000 + Math.random()* 900000).toString(); 

        const user = new User({
            email, 
            password: hashedPassword, 
            name,
            verificationToken,
            verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000 , // 24 hrs
        })

        await user.save(); 

        generateTokenandSetCookie(res, user._id); 
        
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success : true, 
            message : "User Created Successfully", 
            user : {
                ...user._doc, 
                password: undefined
            }
        });

    } catch (error) {
        res.status(400).json({
            success : false , 
            message : error.message
        });
    } 
};

export const verifyEmail = async (req, res) => {
    const {code} = req.body ; 
    try {
        const user = await User.findOne( {
            verificationToken : code, 
            verificationTokenExpiresAt: {$gt : Date.now() }
        })
        if(!user) { 
            return res.status(400).json({
                success : false , 
                message : "Invalid or expired verification code"
            })
        }
        user.isVerified = true ; 
        user.verificationToken = undefined ; 
        user.verificationTokenExpiresAt = undefined ; 

        await user.save() ; 

        await sendWelcomeEmail(user.email, user.name) ;
        
        res.status(200).json({
            success : true, 
            message: "Email Verified successfully", 
            user : [{
                    ...user._doc, 
                    password : undefined,
                }]
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false , 
            message: "Server Error"
        });
    }
};

export const login = async (req, res) => {
    
    const { email, password } = req.body ; 
    
    try {
        const user = await User.findOne({email}); 
        if(!user){
            console.log("User not found "); 
            return res.status(400).json({
                success: false, 
                message: "User not found please signin", 
            })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password); 
        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        generateTokenandSetCookie(res, user._id); 

        user.lastLogin = new Date(); 
        await user.save(); 

        res.status(200).json({
            success : true, 
            message : "User Logged in", 
            user : {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log(error); 
        res.status(400).json({
            success: false, 
            message: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {
    
    const {email} = req.body; 
    try {
        const user = await User.findOne({email}); 

        if(!user){
            return res.status(400).json({
                success: false, 
                message: "User not found",
            })
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpiresAt = Date.now() + 1*60*60*1000; 

        user.resetPasswordToken = resetToken; 
        user.resetPasswordExpiresAt = resetPasswordExpiresAt ;

        await user.save();  

        //send email 
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true, 
            message: "Password reset link sent to your email",
        });

    } catch (error) {
        console.log(error);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params; 
        const {password} = req.body; 
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt : Date.now()},
        })

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found",
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword ;
        user.resetPasswordToken = undefined, 
        user.resetPasswordExpiresAt = undefined, 

        await user.save();
        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true, 
            message: "Password reset successful",
        })

    } catch (error) {
        
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token"); 
    res.status(200).json({
        success: true,
        message: "Logged out Successfully",
    })
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userid).select("-password"); // -password to unselect the password

        if(!user){
            return res.status(400).json({
                success: false, 
                message: "User not found",
            })
        }

        res.status(200).json({
            success: true, 
            user : {
                ...user._doc, 
                resetPasswordExpiresAt : undefined, 
                resetPasswordToken: undefined,

            }
        })
    
    } catch (error) {
        console.log(error, "Error in check auth"); 
        return res.status(400).json({
            success: false, 
            message: error.message,
        })
    }
};