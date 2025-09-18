import {
  CreateCompanyData,
  createCompanySchema,
} from "@/lib/validations/company";
import { db } from "@/server/db";
import { and, asc, desc, eq, ilike, like } from "drizzle-orm";
import { companies } from "drizzle/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let intStatus = 0;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("type");
  if (status == "pending") {
    intStatus = 0;
  } else if (status == "active") {
    intStatus = 1;
  } else {
    intStatus = 2;
  }

  console.log("intStatus", status);
  try {
    const companiesList = await db
      .select()
      .from(companies)
      .where(and(eq(companies.status, intStatus), eq(companies.isactive, true)))
      .orderBy(desc(companies.companyid));
    return NextResponse.json({ companies: companiesList });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error getting companies!" },
      { status: 500 },
    );
  }
}
