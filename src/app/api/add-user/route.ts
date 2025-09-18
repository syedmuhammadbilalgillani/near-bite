import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {name,email} = await req.json();
    try {
        await db.insert(users).values({name,email});
        return NextResponse.json({message:"User added!"})
    } catch (error) {
        return NextResponse.json({message: "Error adding user!"},{status:500})
    }
}