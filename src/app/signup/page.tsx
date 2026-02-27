"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios  from "axios";
import { toast } from "react-hot-toast";


export default function signup() {
  const router = useRouter();
  const[user,setUser] = React.useState({
    name:"",
    email:"",
    password:""
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login")
      
    } catch (error:any) {
      console.log("Signup failed",error.message);
      
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.name.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
      
    }
},[user])

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 text-white px-4">
        <h1>{loading ? "Processing" : "Signup"}</h1>
        <hr />
        <label htmlFor="username">Username</label>
        <input
          className="p-3 border border-gray-300 rounded-md mb-4 bg-white text-black"
          id="username"
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Username..."
        />
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
          onClick={onSignup}
        >
          {buttonDisabled ? "No Signup" : "Signup"}
        </button>
        <Link href="/login" className="text-blue-500">
          Already have an account? Login
        </Link>
      </div>
    );
}