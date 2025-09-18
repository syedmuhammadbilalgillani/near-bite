

import { createCategorySchema } from "@/lib/validations/category";
import { createProductSchema } from "@/lib/validations/product";
import { db } from "@/server/db"; // Adjust the path to your DB connection
import { eq } from "drizzle-orm";
import { categories, productinventory, products } from "drizzle/schema"; // Adjust based on your schema
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const result = await db
        .select()
        .from(categories)
        .where(eq(categories.categoryid,parseInt(id)))       
        .limit(1);      

        return NextResponse.json({ data:result.length>0?result[0]:[] });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ message: "Error updating." }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {       
        const body = await req.json();
        const parsedData = createCategorySchema.parse(body); 
        const categoriesData = {
            ...parsedData,            
        };
        if(body.image != ""){
            categoriesData.image = body.image;
        }
        
        
        if(parseInt(body.parentcategoryid) != 0){
            categoriesData.parentcategoryid = body.parentcategoryid;
        }
    
       
        const result = await db.update(categories)
            .set(categoriesData) 
            .where(eq(categories.categoryid,parseInt(id)));  
       
                      
        return NextResponse.json({ message: "Updated successfully." });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ message: "Error updating at this moment." }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {        
        const result = await db.delete(categories).where(eq(categories.categoryid, parseInt(id)));  
        return NextResponse.json({ message: "Successfully Deleted." });
    } catch (error) {
        return NextResponse.json({ message: "Unable to delete the item at this moment!" }, { status: 500 });
    }
}
