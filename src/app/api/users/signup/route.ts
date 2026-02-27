import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import mongoose from 'mongoose'; // added mongoose import
import { sendEmail } from "../../../../helpers/mailtrap";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { name, email, password } = reqBody
        
        console.log(reqBody);

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
                error: "Database connection failed. Please check your MongoDB configuration and network connection.", 
                status: mongoose.connection.readyState
            }, {status: 503})
        }

        console.log('Checking if user exists for email:', email);
        const user = await User.findOne({ email })
        console.log('Found user:', user);
        
        if (user) {
            return NextResponse.json({error:"User already exists"},{status:400})
        }

        // Validate input
        if (!name || name.trim().length === 0) {
            return NextResponse.json({error:"Username is required"},{status:400})
        }
        
        if (!email || email.trim().length === 0) {
            return NextResponse.json({error:"Email is required"},{status:400})
        }
        
        if (!password || password.length < 6) {
            return NextResponse.json({error:"Password must be at least 6 characters"},{status:400})
        }

        //hash password 
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)
        
        const newUser = new User({
            username: name,
            email,
            password:hashedPassword
        })

        const saveUser = await newUser.save()
        console.log("User saved:", saveUser);

        // Wait a moment to ensure user is fully saved before setting token
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Sending verification email...");
        const emailResult = await sendEmail({email,emailType:"VERIFY",userId:saveUser._id})
        console.log("Email sent result:", emailResult);

        return NextResponse.json({
          message: "User created successfully",
          success: true,
          saveUser
        });
        
        
    } catch (error:any) {
        console.log("Signup error:", error);
        return NextResponse.json({
            error: error.message || "Signup failed",
            details: error.toString()
        },{status:500})
    }
}