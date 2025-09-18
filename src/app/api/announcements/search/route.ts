import {db} from "@/server/db";
import {and, desc, eq, ilike, or} from "drizzle-orm";
import {announcements, companies} from "drizzle/schema";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const term = searchParams.get("term");
  
  // If no search term is provided, return all active announcements
  if (!term || typeof term !== "string") {
    try {
      const list = await db
        .select({
          announcement: {...announcements},
          companyName: companies.companyname,
        })
        .from(announcements)
        .where(eq(announcements.isactive, true)) // Optional: Only active announcements
        .leftJoin(companies, eq(announcements.companyid, companies.companyid))
        .orderBy(desc(announcements.createdat));
      
      return NextResponse.json({announcements: list});
    } catch (error: any) {
      return NextResponse.json(
        {message: "Error getting announcements!"},
        {status: 500}
      );
    }
  }
  
  // If a search term is provided, filter announcements by title or content
  try {
    const list = await db
      .select({
        announcement: {...announcements},
        companyName: companies.companyname,
      })
      .from(announcements)
      .where(
        and(
          eq(announcements.isactive, true), // Optional: Only active announcements
          or(
            ilike(announcements.title, `%${term.toLowerCase()}%`),
            ilike(announcements.content, `%${term.toLowerCase()}%`)
          )
        )
      )
      .leftJoin(companies, eq(announcements.companyid, companies.companyid))
      .orderBy(desc(announcements.createdat));
    
    return NextResponse.json({announcements: list});
  } catch (error: any) {
    return NextResponse.json(
      {message: "Error getting announcements!"},
      {status: 500}
    );
  }
}
