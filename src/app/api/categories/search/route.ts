import { CreateCompanyData, createCompanySchema } from "@/lib/validations/company";
import { db } from "@/server/db";
import { and, asc, desc, eq, ilike, like, or } from "drizzle-orm";
import { categories, companies, products } from "drizzle/schema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    const { searchParams } = new URL(req.url);
    const term = searchParams.get('term');
    
    if (!term || typeof term !== 'string') {       
        const list = await db
        .select()
        .from(categories)        
        .orderBy(desc(categories.categoryid));
        return NextResponse.json({ categories:list });
    }
    try {
        const list = await db
        .select()
        .from(categories)
        .where(ilike(categories.categoryname,`%${term.toLocaleLowerCase()}%`))        
        .orderBy(desc(categories.categoryid));
        return NextResponse.json({ categories:list });
    } catch (error:any) {       
        return NextResponse.json({ message: "Error getting categories!" }, { status: 500 });
    }
}

