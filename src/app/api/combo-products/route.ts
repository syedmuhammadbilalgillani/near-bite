import {
  CreateComboProductData,
  createComboProductSchema,
} from "@/lib/validations/combos";
import {
  CreateProductData,
  createProductSchema,
} from "@/lib/validations/product";
import { db } from "@/server/db";
import { asc, desc, eq, sql } from "drizzle-orm";
import {
  categories,
  comboitems,
  combos,
  productinventory,
  products,
} from "drizzle/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const list = await db.execute(
      sql`
            SELECT 
                combos.*, 
                json_agg(
                    products.*
                ) AS comboItems
            FROM combos
            LEFT JOIN comboitems ON comboitems.comboid = combos.comboid
            LEFT JOIN products ON products.productid = comboitems.productid
            WHERE combos.isactive = true
            GROUP BY combos.comboid
            ORDER BY combos.comboid DESC;
            `,
    );
    return NextResponse.json({ products: list }, { status: 200 });
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

    const parsedData: CreateComboProductData =
      createComboProductSchema.parse(body);

    const productsData: any = {
      ...parsedData,
      companyid: 1,
      price: parseFloat(parsedData.price),
      startdate: new Date(parsedData.startdate).toISOString(),
      enddate: new Date(parsedData.enddate).toISOString(),
      isactive: true,
    };
    if (body.image != "") {
      productsData.image = body.image;
    }

    const product = await db
      .insert(combos)
      .values(productsData)
      .returning()
      .then((res) => res[0]);

    if (product?.comboid) {
      const comb = await db
        .insert(comboitems)
        .values(
          body.products.map((item: any) => ({
            comboid: parseInt(product?.comboid),
            productid: item.productid,
            quantity: item.quantity,
          })),
        )
        .returning()
        .then((res) => res[0]);
      return NextResponse.json({ product, comb });
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
