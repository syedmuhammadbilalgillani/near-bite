import {CreateCategoryData, createCategorySchema} from "@/lib/validations/category";
import {CreateProductData, createProductSchema} from "@/lib/validations/product";
import {db} from "@/server/db";
import {asc, desc, eq} from "drizzle-orm";
import {categories, products} from "drizzle/schema";
import {NextRequest, NextResponse} from "next/server";
import {z} from 'zod';

export async function GET() {
  try {
    
    const list = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.categoryid));
    return NextResponse.json({categories: list}, {status: 200});
  } catch (error: any) {
    return NextResponse.json({message: "Error getting companies!"}, {status: 500});
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const parsedData: CreateCategoryData = createCategorySchema.parse(body);
    
    let categoriesData = {
      ...parsedData
    };
    if (body.image != "") {
      categoriesData.image = body.image;
    }
    
    
    if (parseInt(body.parentcategoryid) != 0) {
      categoriesData.parentcategoryid = body.parentcategoryid;
    }
    
    const category = await db
      .insert(categories)
      .values(categoriesData)
      .returning()
      .then((res) => res[0]);
    
    return NextResponse.json({category});
    
    
  } catch (error: any) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({message: error.errors}, {status: 400});
    }
    return NextResponse.json({message: "Error adding category!"}, {status: 500});
  }
}

