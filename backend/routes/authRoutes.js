import express from "express";
import { isAuthenticated, login, logout, register, sendVerfiyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', userAuth, sendVerfiyOtp)
authRouter.post('/verify-account', userAuth, verifyEmail)
authRouter.post('/is-auth', userAuth, isAuthenticated)


export default authRouter;