import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody
        
        console.log('Login attempt for email:', email);

        // Try to connect if not already connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, attempting connection...');
            await connect();
            
            // Wait a moment for connection to establish
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Check connection status again
        if (mongoose.connection.readyState !== 1) {
            return NextResponse.json({
                error: "Database connection failed. Please check your MongoDB configuration.", 
                status: mongoose.connection.readyState
            }, {status: 503})
        }

        const user = await User.findOne({ email })
        console.log('Found user:', user ? 'Yes' : 'No');
        console.log('User fields:', Object.keys(user || {}));
        console.log('User password field:', user?.password);
        console.log('User _doc fields:', user ? Object.keys(user._doc) : 'No user');
        console.log('User _doc password:', user?._doc?.password);
        
        if (!user) {
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }

        const userPassword = user.password || user._doc?.password;
        if (!userPassword) {
            return NextResponse.json({error: "User account incomplete. Please sign up again."}, {status: 400})
        }

        const validPassword = await bcryptjs.compare(password, userPassword)
        console.log('Password valid:', validPassword);
        
        if (!validPassword) {
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        console.log('Token generated successfully');

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })

        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response;
        
    } catch (error: any) {
        console.log("Login error:", error);
        return NextResponse.json({
            error: error.message || "Login failed",
            details: error.toString()
        }, {status: 500})
    }
}