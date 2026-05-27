import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT SECRET:", process.env.JWT_SECRET);

    const body = await req.json();

    const { title, location, description, price, propertyType } = body;
    if (!title || !location || !price || !propertyType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!["residential", "commercial"].includes(propertyType)) {
      return NextResponse.json(
        { error: "Invalid property type" },
        { status: 400 },
      );
    }

    if (price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    const result = await pool.query(
      `INSERT INTO properties 
   (user_id, title, location, description, price, property_type)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
      [decoded.userId, title, location, description, price, propertyType],
    );

    return NextResponse.json({ property: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT * FROM properties WHERE user_id = $1 ORDER BY created_at DESC",
      [decoded.userId],
    );

    return NextResponse.json({ properties: result.rows });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}
