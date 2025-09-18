import { createAnnouncementSchema } from "@/lib/validations/announcement"; // Adjust to your actual schema path
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { announcements } from "drizzle/schema";
import { NextResponse } from "next/server";

// GET request to retrieve a single announcement by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const result = await db
      .select()
      .from(announcements)
      .where(eq(announcements.announcementid, parseInt(id)))
      .limit(1);

    return NextResponse.json({ data: result.length > 0 ? result[0] : [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error retrieving announcement." },
      { status: 500 },
    );
  }
}

// PUT request to update an existing announcement by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const body = await req.json();
    const parsedData = createAnnouncementSchema.parse(body); // Validate the request data

    // Pass date fields directly as strings, without converting to Date objects
    const announcementData = {
      ...parsedData,
      startdate: parsedData.startdate || null, // Directly use the ISO string or null
      enddate: parsedData.enddate || null, // Directly use the ISO string or null
      isactive: parsedData.isactive ?? true,
    };

    await db
      .update(announcements)
      .set(announcementData)
      .where(eq(announcements.announcementid, parseInt(id)));

    return NextResponse.json({ message: "Announcement updated successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}

// DELETE request to remove an announcement by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: number } },
) {
  const { id } = params;
  console.log(id);
  try {
    await db
      .delete(announcements)
      .where(eq(announcements.announcementid, parseInt(id)));
    return NextResponse.json({ message: "Announcement deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting announcement." },
      { status: 500 },
    );
  }
}
