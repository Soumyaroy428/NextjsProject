import { connect } from "../../../../dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/userModel";
import mongoose from 'mongoose';

connect();

export async function POST(request: NextRequest) {
    try {
        // Try to connect if not already connected
        if (mongoose.connection.readyState !== 1) {
            await connect();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Check connection status again
        if (mongoose.connection.readyState !== 1) {
            return NextResponse.json({
                error: "Database connection failed", 
                status: mongoose.connection.readyState
            }, {status: 503})
        }

        const reqBody = await request.json()
        const { token } = reqBody;
        console.log("Verification token received:", token);
        console.log("Token length:", token?.length);

        // First, let's see if any user has this token
        const userWithToken = await User.findOne({ verifyToken: token });
        console.log("User with token found:", userWithToken ? "YES" : "NO");
        
        // Let's also check all users to see what tokens exist
        const allUsers = await User.find({});
        console.log("Total users in DB:", allUsers.length);
        allUsers.forEach(user => {
            console.log(`User: ${user.email}, has verifyToken: ${user.verifyToken ? 'YES' : 'NO'}, isVerfied: ${user.isVerfied}`);
        });

        // Now check with expiry
        const user = await User.findOne({ 
            verifyToken: token, 
            verifyTokenExpairy: { $gt: Date.now() } 
        })
        console.log("User with valid token found:", user ? "YES" : "NO");
        
        if (!user) {
            console.log("User not found or token expired");
            return NextResponse.json({error:"Invalid or expired token"},{status:400})
        }
        console.log("User found:", user);
        
        user.isVerfied = true;
        user.verifyToken = undefined;
        user.verifyTokenExpairy = undefined;
        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })
        
    } catch (error: any) {
        console.log("Email verification error:", error);
        return NextResponse.json({error:error.message},{status:500})
    }
}