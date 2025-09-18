import { createComboProductSchema } from "@/lib/validations/combos";
import {db} from "@/server/db";
import {asc, eq} from "drizzle-orm";
import {combos, comboitems, products} from "drizzle/schema";
import {NextResponse} from "next/server";
import * as console from "node:console";

export async function GET(req: Request, {params}: { params: { id: string } }) {
  const {id} = params;
  try {
    // Fetch combo with items and product details
    const comboWithItems = await db
      .select({
        combo: {
          comboid: combos.comboid,
          companyid: combos.companyid,
          name: combos.name,
          description: combos.description,
          price: combos.price,
          image: combos.image,
          isactive: combos.isactive,
          startdate: combos.startdate,
          enddate: combos.enddate,
          createdat: combos.createdat,
          updatedat: combos.updatedat
        },
        comboitems: {
          comboitemid: comboitems.comboitemid,
          productid: comboitems.productid,
          quantity: comboitems.quantity,
          createdat: comboitems.createdat,
          updatedat: comboitems.updatedat
        },
        product: {
          productid: products.productid,
          name: products.name,
          image: products.image,
          description: products.description,
          baseprice: products.baseprice,
          categoryid: products.categoryid,
          companyid: products.companyid,
          createdat: products.createdat,
          updatedat: products.updatedat
        }
      })
      .from(combos)
      .leftJoin(comboitems, eq(combos.comboid, comboitems.comboid))
      .leftJoin(products, eq(comboitems.productid, products.productid))
      .where(eq(combos.comboid, parseInt(id)))
      .orderBy(asc(comboitems.comboitemid));
    
    if (!comboWithItems.length) {
      return NextResponse.json({message: "Combo not found"}, {status: 404});
    }
    
    // Extract combo data (assuming all rows have the same combo info)
    const {combo} = comboWithItems[0];
    const comboData = {
      comboid: combo.comboid,
      companyid: combo.companyid,
      name: combo.name,
      description: combo.description,
      price: combo.price,
      image: combo.image,
      isactive: combo.isactive,
      startdate: combo.startdate,
      enddate: combo.enddate,
      createdat: combo.createdat,
      updatedat: combo.updatedat
    };
    
    // Extract combo items with product details
    const comboItems = comboWithItems.map(item => ({
      comboitemid: item.comboitems.comboitemid,
      productid: item.comboitems.productid,
      quantity: item.comboitems.quantity,
      createdat: item.comboitems.createdat,
      updatedat: item.comboitems.updatedat,
      product: {
        productid: item.product.productid,
        name: item.product.name,
        image: item.product.image,
        description: item.product.description,
        baseprice: item.product.baseprice,
        categoryid: item.product.categoryid,
        companyid: item.product.companyid,
        createdat: item.product.createdat,
        updatedat: item.product.updatedat
      }
    }));
    
    return NextResponse.json(
      {comboData, comboItems},
      {status: 200}
    );
    
  } catch (error) {
    console.error("Error getting combo with items:", error);
    return NextResponse.json({message: "Error getting combo with items!"}, {status: 500});
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {       
      const body = await req.json();
      const parsedData = createComboProductSchema.parse(body); 
      const productsData:any = {
        ...parsedData,        
        price: parseFloat(parsedData.price),
        isactive:true,
        startdate: new Date(parsedData.startdate).toISOString(),
        enddate: new Date(parsedData.enddate).toISOString(),        
      };
      if (body.image != "") {
        productsData.image = body.image;
      }     
           
     
      await db.update(combos).set(productsData).where(eq(combos.comboid,parseInt(id)));    
      await db.delete(comboitems).where(eq(comboitems.comboid, parseInt(id)));
      await db
        .insert(comboitems)
        .values(
          body.products.map((item: any) => ({
            comboid: parseInt(id),
            productid: item.productid,
            quantity: item.quantity
          }))
        );            
      return NextResponse.json({ message: "Updated successfully." });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return NextResponse.json({ message: "Error updating at this moment." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {        
      await db.delete(comboitems).where(eq(comboitems.comboid, parseInt(id)));
      const result = await db.delete(combos).where(eq(combos.comboid, parseInt(id)));   
      return NextResponse.json({ message: "Successfully Deleted." });
  } catch (error) {
      return NextResponse.json({ message: "Unable to delete the item at this moment!" }, { status: 500 });
  }
}
