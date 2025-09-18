import { createCompanySchema } from "@/lib/validations/company";
import { db } from "@/server/db"; // Adjust the path to your DB connection
import { eq, and, inArray } from "drizzle-orm";
import { companies, combos, products, categories } from "drizzle/schema"; // Adjust based on your schema
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.companyid, parseInt(id)))
      .limit(1);

    const comboData = await db
      .select()
      .from(combos)
      .where(
        and(eq(combos.companyid, parseInt(id)), eq(combos.isactive, true)),
      );

    const productData = await db
      .select()
      .from(products)
      .where(
        and(eq(products.companyid, parseInt(id)), eq(products.isactive, true)),
      );
    const categoryIds = [
      ...new Set(productData.map((product) => product.categoryid)),
    ].filter((id) => id !== null);

    // Fetch category data based on unique category IDs
    const categoriesData =
      categoryIds.length > 0
        ? await db
            .select()
            .from(categories)
            .where(inArray(categories.categoryid, categoryIds))
        : [];

    return NextResponse.json(
      {
        data: result.length > 0 ? result[0] : [],
        comboData,
        productData,
        categoriesData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: "Error updating company.ss" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const body = await req.json();
    const parsedData = createCompanySchema.parse(body);
    const companyData = {
      ...parsedData,
      latitude: parsedData.latitude.toString(),
      longitude: parsedData.longitude.toString(),
      status: parseInt(parsedData.status),
      licensecompliance: parsedData.licensecompliance == "yes" ? true : false,
    };

    console.log(companyData);

    const result = await db
      .update(companies)
      .set(companyData)
      .where(eq(companies.companyid, parseInt(id)));
    console.log(result);
    return NextResponse.json({ message: "Company updated successfully." });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: "Error updating company." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const result = await db
      .update(companies)
      .set({ isactive: false })
      .where(eq(companies.companyid, parseInt(id)));
    return NextResponse.json({ message: "Company deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting company." },
      { status: 500 },
    );
  }
}
