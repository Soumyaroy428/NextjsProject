"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { log } from "node:console"

export default function ProfilePages() {

    const router = useRouter();
    const [data,setData]= useState("nothing")
    const logout = async () => {
        try {
            await axios.get("/api/users/logout")
            toast.success("Logout successful")
            window.location.href = "/login";
        } catch (error: any) {
            console.log("Auth check failed:", error);
            window.location.href = "/login";
        }
    }

    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me')
        console.log(res.data);
        setData(res.data.data._id)
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 text-white px-4">
        <h1>Profile</h1>
        <hr />
        <h2>
          {data === "nothing" ? (
            "Nothing"
          ) : (
                        <Link href={`/profile/${data}`}>{data}</Link>
          )}
        </h2>

        <div className="space-x-4 mt-4">
          <button
            onClick={logout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Logout
          </button>
          <button
            onClick={getUserDetails}
            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            GetUser Details
          </button>
          <Link href="/profile/123" className="text-blue-500 hover:underline">
            View Sample Profile
          </Link>
        </div>
      </div>
    );
}