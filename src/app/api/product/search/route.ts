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
        .select({
            product: {...products}, 
            categoryName: categories.categoryname, 
          })
        .from(products)
        .where(eq(products.isactive,true))
        .leftJoin(categories, eq(products.categoryid, categories.categoryid))
        .orderBy(desc(products.productid));
        return NextResponse.json({ products:list });
    }
    try {
        const list = await db
        .select({
            product: {...products}, 
            categoryName: categories.categoryname, 
          })
        .from(products)
        .where( or(ilike(products.name,`%${term.toLocaleLowerCase()}%`),ilike(products.description,`%${term.toLocaleLowerCase()}%`) ))
        .leftJoin(categories, eq(products.categoryid, categories.categoryid))
        .orderBy(desc(products.productid));
        return NextResponse.json({ products:list });
    } catch (error:any) {       
        return NextResponse.json({ message: "Error getting products!" }, { status: 500 });
    }
}

