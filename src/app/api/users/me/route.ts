import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).
      select("-password");
    return NextResponse.json({
      message: "User Found",
      data:user
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
