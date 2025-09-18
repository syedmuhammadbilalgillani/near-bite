

import { createProductSchema } from "@/lib/validations/product";
import { db } from "@/server/db"; // Adjust the path to your DB connection
import { eq } from "drizzle-orm";
import { productinventory, products } from "drizzle/schema"; // Adjust based on your schema
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const result = await db
        .select({...products, itemsAvailable: productinventory.quantityavailable})
        .from(products)
        .where(eq(products.productid,parseInt(id)))
        .leftJoin(productinventory, eq(products.productid, productinventory.productid))
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
        const parsedData = createProductSchema.parse(body); 
        const productsData = {
            ...parsedData,
            categoryid: parseInt(parsedData.categoryid),
            baseprice: parseFloat(parsedData.baseprice),
            inqwerty: parsedData.inqwerty == "yes",
            isactive:true
        };
        if(body.image != ""){
            productsData.image = body.image;
        }              
       
        const result = await db.update(products)
            .set(productsData) 
            .where(eq(products.productid,parseInt(id)));    
        // update inventory
        const inventory = await db
            .update(productinventory)
            .set({quantityavailable: parseInt(parsedData.inventory)})            
            .where(eq(productinventory.productid,parseInt(id)));  
                      
        return NextResponse.json({ message: "Updated successfully." });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ message: "Error updating at this moment." }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {        
        await db.delete(productinventory).where(eq(productinventory.productid, parseInt(id)));
        const result = await db.delete(products).where(eq(products.productid, parseInt(id)));
        console.log(result)  
        return NextResponse.json({ message: "Successfully Deleted." });
    } catch (error) {
        return NextResponse.json({ message: "Unable to delete the item at this moment!" }, { status: 500 });
    }
}
