import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Fetch user using Drizzle ORM
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // // Verify password
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    // if (!isPasswordValid) {
    //   return NextResponse.json(
    //     { error: "Invalid email or password" },
    //     { status: 401 },
    //   );
    // }

    // Generate JWT
    const token = jwt.sign(
      { id: user.userid, email: user.email },
      process.env.NEXTAUTH_SECRET || "default_secret",
      { expiresIn: "1h" },
    );

    return NextResponse.json({ token, expiresIn: "1h" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
