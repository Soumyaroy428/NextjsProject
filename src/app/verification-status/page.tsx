"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function VerificationStatusPage() {
    const [status, setStatus] = useState("checking");
    const [token, setToken] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [dbStatus, setDbStatus] = useState<any>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");
        setToken(urlToken || "");
        
        if (urlToken) {
            checkTokenInDB(urlToken);
        } else {
            setStatus("no-token");
        }
    }, []);

    const checkTokenInDB = async (tokenToCheck: string) => {
        try {
            setStatus("checking-db");
            
            // Check if token exists in database
            const response = await axios.post("/api/users/checkToken", { token: tokenToCheck });
            console.log("Token check response:", response.data);
            
            if (response.data.found) {
                setUserEmail(response.data.userEmail);
                setDbStatus({
                    found: true,
                    email: response.data.userEmail,
                    isVerified: response.data.isVerified,
                    hasExpiry: response.data.hasExpiry,
                    isExpired: response.data.isExpired,
                    expiryDate: response.data.expiryDate
                });
                
                if (response.data.isExpired) {
                    setStatus("expired");
                } else if (response.data.isVerified) {
                    setStatus("already-verified");
                } else {
                    setStatus("valid");
                }
            } else {
                setStatus("not-found");
            }
        } catch (error: any) {
            console.log("Token check error:", error);
            setStatus("error");
        }
    };

    const attemptVerification = async () => {
        try {
            setStatus("verifying");
            const response = await axios.post("/api/users/verifyemail", { token });
            console.log("Verification response:", response.data);
            
            if (response.data.success) {
                setStatus("verified");
            } else {
                setStatus("verification-failed");
            }
        } catch (error: any) {
            console.log("Verification error:", error);
            setStatus("verification-error");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 text-white px-4">
            <h1 className="text-3xl font-bold mb-6">Email Verification Status</h1>
            
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                <div className="mb-4">
                    <p><strong>Token:</strong> {token.substring(0, 20)}...</p>
                </div>
                
                <div className="mb-4">
                    <p><strong>Status:</strong> {status}</p>
                </div>

                {dbStatus && (
                    <div className="mb-4 p-4 bg-gray-700 rounded">
                        <h3 className="font-semibold mb-2">Database Information:</h3>
                        <p><strong>Email:</strong> {dbStatus.email}</p>
                        <p><strong>Token Found:</strong> {dbStatus.found ? "YES" : "NO"}</p>
                        <p><strong>Is Verified:</strong> {dbStatus.isVerified ? "YES" : "NO"}</p>
                        <p><strong>Has Expiry:</strong> {dbStatus.hasExpiry ? "YES" : "NO"}</p>
                        <p><strong>Is Expired:</strong> {dbStatus.isExpired ? "YES" : "NO"}</p>
                        {dbStatus.expiryDate && (
                            <p><strong>Expiry Date:</strong> {new Date(dbStatus.expiryDate).toLocaleString()}</p>
                        )}
                    </div>
                )}

                {status === "valid" && (
                    <div className="text-center">
                        <button
                            onClick={attemptVerification}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Verify Email
                        </button>
                    </div>
                )}

                {status === "verified" && (
                    <div className="text-center text-green-500">
                        <h2 className="text-xl font-bold">Email Verified Successfully!</h2>
                        <Link href="/login" className="text-blue-500 underline mt-4">Go to Login</Link>
                    </div>
                )}

                {status === "expired" && (
                    <div className="text-center text-red-500">
                        <h2 className="text-xl font-bold">Token Expired</h2>
                        <p className="mb-4">The verification link has expired. Please sign up again.</p>
                        <Link href="/signup" className="text-blue-500 underline">Sign Up Again</Link>
                    </div>
                )}

                {status === "not-found" && (
                    <div className="text-center text-red-500">
                        <h2 className="text-xl font-bold">Token Not Found</h2>
                        <p className="mb-4">This verification link is invalid.</p>
                        <Link href="/signup" className="text-blue-500 underline">Sign Up Again</Link>
                    </div>
                )}

                {status === "already-verified" && (
                    <div className="text-center text-yellow-500">
                        <h2 className="text-xl font-bold">Already Verified</h2>
                        <p className="mb-4">This email has already been verified.</p>
                        <Link href="/login" className="text-blue-500 underline">Go to Login</Link>
                    </div>
                )}

                {status === "verification-failed" && (
                    <div className="text-center text-red-500">
                        <h2 className="text-xl font-bold">Verification Failed</h2>
                        <p className="mb-4">There was an error verifying your email.</p>
                        <button
                            onClick={attemptVerification}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-blue-500 underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
