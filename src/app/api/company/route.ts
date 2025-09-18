import {CreateCompanyData, createCompanySchema} from "@/lib/validations/company";
import {db} from "@/server/db";
import {asc, desc, eq} from "drizzle-orm";
import {companies} from "drizzle/schema";
import {NextRequest, NextResponse} from "next/server";
import {z} from 'zod';

export async function GET() {
  try {
    
    const companiesList = await db.select().from(companies).where(eq(companies.isactive, true)).orderBy(desc(companies.companyid));
    return NextResponse.json({companies: companiesList});
  } catch (error: any) {
    return NextResponse.json({message: "Error getting companies!"}, {status: 500});
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const parsedData: CreateCompanyData = createCompanySchema.parse(body);
    
    const companyData = {
      ...parsedData,
      latitude: parsedData.latitude.toString(),
      longitude: parsedData.longitude.toString(),
      isactive: true,
      status: parseInt(parsedData.status),
      licensecompliance: parsedData.licensecompliance == 'yes' ? true : false,
    };
    
    const company = await db
      .insert(companies)
      .values(companyData)
      .returning()
      .then((res) => res[0]);
    
    return NextResponse.json({company});
  } catch (error: any) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({message: error.errors}, {status: 400});
    }
    return NextResponse.json({message: "Error adding company!"}, {status: 500});
  }
}
