import { db } from "@/server/db";
import { eq, desc } from "drizzle-orm";
import { announcements, companies } from "drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CreateAnnouncementData,
  createAnnouncementSchema,
} from "@/lib/validations/announcement";

// GET request to retrieve announcements
export async function GET() {
  try {
    const list = await db
      .select({
        announcement: { ...announcements },
        companyName: companies.companyname,
      })
      .from(announcements)
      .leftJoin(companies, eq(announcements.companyid, companies.companyid))
      .where(eq(announcements.isactive, true)) // Optional: Filter for active announcements
      .orderBy(desc(announcements.createdat));

    return NextResponse.json({ announcements: list });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error retrieving announcements!" },
      { status: 500 },
    );
  }
}

// POST request to create a new announcement

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const parsedData = createAnnouncementSchema.parse(body);

    // Create announcement data with dates as ISO strings
    const announcementData = {
      ...parsedData,
      companyid: parseInt(parsedData.companyid, 10),
      startdate: parsedData.startdate
        ? new Date(parsedData.startdate).toISOString()
        : null,
      enddate: parsedData.enddate
        ? new Date(parsedData.enddate).toISOString()
        : null,
      isactive: parsedData.isactive ?? true,
    };

    // Insert announcement into the database
    const announcement = await db
      .insert(announcements)
      .values(announcementData)
      .returning()
      .then((res) => res[0]);

    return NextResponse.json({ announcement });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Error creating announcement!" },
      { status: 500 },
    );
  }
}
