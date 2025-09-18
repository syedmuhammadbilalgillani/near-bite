import { CreateCompanyData, createCompanySchema } from "@/lib/validations/company";
import { db } from "@/server/db";
import { and, asc, desc, eq, ilike, like } from "drizzle-orm";
import { companies } from "drizzle/schema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    const { searchParams } = new URL(req.url);
    const term = searchParams.get('term');
    
    if (!term || typeof term !== 'string') {       
        const companiesList = await db.select().from(companies).where(eq(companies.isactive,true)).orderBy(desc(companies.companyid));
        return NextResponse.json({ companies:companiesList });
    }
    try {
        const companiesList = await db.select().from(companies).where( and(ilike(companies.companyname,`%${term.toLocaleLowerCase()}%`),eq(companies.isactive,true) )).orderBy(desc(companies.companyid));
        return NextResponse.json({ companies:companiesList });
    } catch (error:any) {       
        return NextResponse.json({ message: "Error getting companies!" }, { status: 500 });
    }
}

