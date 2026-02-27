const nodemailer = require('nodemailer')
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            console.log("Setting verification token for user ID:", userId);
            console.log("Hashed token:", hashedToken);
            console.log("Expiry date to set:", new Date(Date.now() + 3600000 * 24));
            
            // Find user first, then update and save
            const user = await User.findById(userId);
            if (user) {
                user.verifyToken = hashedToken;
                user.verifyTokenExpiry = Date.now() + 3600000 * 24;
                const saveResult = await user.save();
                console.log("User save result:", saveResult);
                console.log("User after save:", {
                    verifyToken: user.verifyToken ? "SET" : "NOT SET",
                    verifyTokenExpiry: user.verifyTokenExpiry ? "SET" : "NOT SET",
                    expiryDate: user.verifyTokenExpiry
                });
            } else {
                console.log("User not found for ID:", userId);
            }
            
            console.log("Verification token set successfully");
        } else if (emailType === "RESET") {
            console.log("Setting password reset token for user ID:", userId);
            console.log("Hashed token:", hashedToken);
            console.log("Expiry date to set:", new Date(Date.now() + 3600000 * 24));
            
            // Find user first, then update and save
            const user = await User.findById(userId);
            if (user) {
                user.forgotPasswordToken = hashedToken;
                user.forgotPasswordTokenExpiry = Date.now() + 3600000 * 24;
                const saveResult = await user.save();
                console.log("User save result:", saveResult);
                console.log("User after save:", {
                    forgotPasswordToken: user.forgotPasswordToken ? "SET" : "NOT SET",
                    forgotPasswordTokenExpiry: user.forgotPasswordTokenExpiry ? "SET" : "NOT SET",
                    expiryDate: user.forgotPasswordTokenExpiry
                });
            } else {
                console.log("User not found for ID:", userId);
            }
            
            console.log("Password reset token set successfully");
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "91663c244aec60",
                pass: "321a9e93dba04e",
            },
        });

        const mailOptions = {
            from: "soumyaroy1460@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="http://localhost:3000/verifyEmail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        console.log("Email sent successfully:", mailResponse);
        return mailResponse;

    } catch (error: any) {
        console.log("Email sending error:", error);
        throw new Error(error.message);
    }
}