"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function login() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/users/login", user);
        console.log("Login Success", response.data);
        toast.success("Login Successful");
        router.push("/profile");
      } catch (error: any) {
        console.log("Login Failed", error);
        console.log("Error response:", error.response?.data);
        console.log("Error status:", error.response?.status);
        toast.error(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
    }
    
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-white px-4">
      <h1>Login</h1>
      <hr />
      <label htmlFor="email">Email</label>
      <input
        className="p-3 border border-gray-300 rounded-md mb-4 bg-white text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email....."
      />
      <label htmlFor="password">Password</label>
      <input
        className="p-3 border border-gray-300 rounded-md mb-4 bg-white text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password....."
      />
      <button
        className="p-3 border border-gray-300 rounded-md mb-4 bg-white text-black cursor-pointer"
        onClick={onLogin}
      >
        Login
      </button>
      <Link href="/signup" className="text-blue-500">
        Don't have an account? Signup
      </Link>
    </div>
  );
}
