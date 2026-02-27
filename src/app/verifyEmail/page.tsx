"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            
            // First check if token exists
            const checkResponse = await axios.post("/api/users/checkToken", { token });
            console.log("Token check result:", checkResponse.data);
            
            // Then try to verify
            const response = await axios.post("/api/users/verifyemail", { token });
            console.log("Verification response:", response.data);
            setVerified(true);
            toast.success("Email verified successfully!");
        } catch (error: any) {
            setError(true);
            console.log("Verification error:", error.response?.data);
            
            // Check if token exists
            try {
                const checkResponse = await axios.post("/api/users/checkToken", { token });
                console.log("Token check after error:", checkResponse.data);
                toast.error(`Token check: ${checkResponse.data.message}`);
            } catch (checkError: any) {
                console.log("Token check failed:", checkError.response?.data);
            }
            
            toast.error(error.response?.data?.error || "Email verification failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        } else {
            setLoading(false);
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 text-white px-4">
            <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
            
            {loading && (
                <div>
                    <h2 className="text-xl">Verifying your email...</h2>
                </div>
            )}
            
            {!loading && !token && (
                <div>
                    <h2 className="text-xl text-red-500">No verification token found</h2>
                    <p className="mb-4">Please check your email and click the verification link.</p>
                    <Link href="/login" className="text-blue-500 underline">Go to Login</Link>
                </div>
            )}
            
            {verified && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-500 mb-4">Email Verified Successfully!</h2>
                    <p className="mb-4">You can now login to your account.</p>
                    <Link href="/login" className="text-blue-500 underline hover:text-blue-400">Go to Login</Link>
                </div>
            )}
            
            {error && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Email Verification Failed!</h2>
                    <p className="mb-4">The verification link may have expired or is invalid.</p>
                    <Link href="/signup" className="text-blue-500 underline hover:text-blue-400">Go to Sign Up</Link>
                </div>
            )}
        </div>
    );
}

