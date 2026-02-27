import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextResponse, NextRequest } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody;
        
        console.log("Checking token:", token);
        
        // Find user with this token
        const user = await User.findOne({ verifyToken: token });
        
        if (!user) {
            return NextResponse.json({
                message: "Token not found in database",
                token: token,
                found: false
            });
        }
        
        return NextResponse.json({
            message: "Token found",
            token: token,
            found: true,
            userEmail: user.email,
            isVerified: user.isVerfied,
            hasExpiry: !!user.verifyTokenExpairy,
            expiryDate: user.verifyTokenExpairy,
            isExpired: user.verifyTokenExpairy ? Date.now() > user.verifyTokenExpairy : false,
            allUserFields: {
                verifyToken: user.verifyToken,
                verifyTokenExpairy: user.verifyTokenExpairy,
                isVerfied: user.isVerfied
            }
        });
        
    } catch (error: any) {
        console.log("Check token error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
