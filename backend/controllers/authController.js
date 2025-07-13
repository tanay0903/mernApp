import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';

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

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days
            });

        // Send welcome email
        const mailoptions = {
            from: process.env.SMTP_SENDER,
            to: email,
            subject: 'Welcome to to-do App',
            text: `Hello ${name},\n\nThank you for registering with our to-do app. We are excited to have you on board! 
            \n\n Your account has been successfully created with the email: ${email}. 
            You can now log in and start managing your tasks.
            \n\nIf you have any questions or need assistance, feel free to reach out to us.
            \n\nBest regards,
            \nThe To-Do App Team`
        }
        await transporter.sendMail(mailoptions);
        return res.status(201).json({success:true, message: "User registered successfully" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false, message: error.message });
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
        res.cookie('token', token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
                maxAge: 1 * 24   * 60 * 60 * 1000 // 7 days
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
        return res.status(200).json({success:true, message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message: error.message});
    }
}

// Send OTP for email verification
export const sendVerfiyOtp = async (req, res) => {
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified) {
            return res.status(400).json({success:false, message: "Account already verified" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;

        user.verifyOtpEXpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        await user.save();

        const mailoptions = {
            from: process.env.SMTP_SENDER,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP for account verification is ${otp}. It is valid for 10 minutes.`
        }
        await transporter.sendMail(mailoptions);
        res.status(200).json({success:true, message: "OTP sent successfully" });

    }catch(error) {
        console.error(error);
        return res.status(500).json({success:false, message: "Server error" });
}
}

// Verify OTP for email verification
export const verifyEmail = async (req, res) => {
    const {userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({success:false, message: "User ID and OTP are required" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({success:false, message: "User not found" });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.status(400).json({success:false, message: "Invalid OTP" });
        }
        if (user.verifyOtpEXpireAt < Date.now()){
            return res.status(400).json({success:false, message: "OTP expired" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpEXpireAt = 0;
        await user.save();
        return res.status(200).json({success:true, message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message: "Server error" });
    }
}

//Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success:true});
    } catch (error) {
        console.error(error);
        return res.json({success:false, message: error.message } );
    }
}