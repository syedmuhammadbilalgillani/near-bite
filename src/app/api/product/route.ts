import {
  CreateProductData,
  createProductSchema,
} from "@/lib/validations/product";
import { db } from "@/server/db";
import { asc, desc, eq } from "drizzle-orm";
import { categories, productinventory, products } from "drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const list = await db
      .select({
        product: { ...products },
        categoryName: categories.categoryname,
        itemsAvailable: productinventory.quantityavailable,
      })
      .from(products)
      .where(eq(products.isactive, true))
      .leftJoin(categories, eq(products.categoryid, categories.categoryid))
      .leftJoin(
        productinventory,
        eq(products.productid, productinventory.productid),
      )
      .orderBy(desc(products.productid));
    return NextResponse.json({ products: list });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error getting companies!" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedData: CreateProductData = createProductSchema.parse(body);

    const productsData = {
      ...parsedData,
      categoryid: parseInt(parsedData.categoryid),
      companyid: 1,
      baseprice: parseFloat(parsedData.baseprice),
      inqwerty: parsedData.inqwerty == "yes",
      isactive: true,
    };
    if (body.image != "") {
      productsData.image = body.image;
    }

    const product = await db
      .insert(products)
      .values(productsData)
      .returning()
      .then((res) => res[0]);

    if (product?.productid) {
      const inventory = await db
        .insert(productinventory)
        .values({
          quantityavailable: parseInt(parsedData.inventory),
          productid: parseInt(product?.productid),
        })
        .returning()
        .then((res) => res[0]);
      return NextResponse.json({ product });
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Error adding product!" },
      { status: 500 },
    );
  }
}
