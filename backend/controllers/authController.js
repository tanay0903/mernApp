import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Register function
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({success:false, message: "All fields are required" });
    }

    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({success:false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie(token, 'token',
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

        return res.status(201).json({success:true, message: "User registered successfully" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false, message: "Server error" });
    }
}


// Login function
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({success:false, message: "All fields are required" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({success:false, message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({success:false, message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie(token, 'token',
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

        return res.status(200).json({success:true, message: "Login successful", user: { id: user._id, name: user.name, email: user.email } }); 
    }
    catch(error) {
        console.error(error);
        res.status(500).json({success:false, message: "Server error" });
    }
}

// Logout function
export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
        })
        return res.status(200).json({success:true, message: "Logout successful  " });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message: "Server error" });
    }
}