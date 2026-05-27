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

    const body = await req.json();

const { 
  title, 
  description, 
  price, 
  weight, 
  type, 
  purity,
  assetForm,
  huidNumbers,
  status
} = body;
    if (!title || !price || !weight || !type || !purity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const allowedGoldPurities = [0.999, 0.916, 0.75];
    const allowedSilverPurities = [0.999, 0.925];

    if (!title || !price || !weight || !purity || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (price <= 0 || weight <= 0) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 },
      );
    }

    if (type === "gold" && !allowedGoldPurities.includes(purity)) {
      return NextResponse.json(
        { error: "Invalid gold purity" },
        { status: 400 },
      );
    }

    if (type === "silver" && !allowedSilverPurities.includes(purity)) {
      return NextResponse.json(
        { error: "Invalid silver purity" },
        { status: 400 },
      );
    }

const result = await pool.query(
  `INSERT INTO metals 
   (user_id, type, title, description, weight, price, asset_form, purity, huid_numbers, status)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
   RETURNING *`,
  [
    decoded.userId,
    type,
    title,
    description,
    weight,
    price,
    assetForm,
    purity,
    JSON.stringify(huidNumbers), // ✅ important
    status || "tokenized",
  ]
);

    return NextResponse.json({ metal: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create metal" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("❌ No token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);
    console.log("JWT SECRET:", process.env.JWT_SECRET);
    console.log("TOKEN:", token);

    console.log("✅ User ID:", decoded.userId);

    const result = await pool.query(
      "SELECT * FROM metals WHERE user_id = $1 ORDER BY created_at DESC",
      [decoded.userId]
    );

    console.log("✅ Metals fetched:", result.rows.length);

    return NextResponse.json({ metals: result.rows });

  } catch (err) {
    console.error("🔥 GET /api/metals ERROR:", err);

    return NextResponse.json(
      { error: err.message }, // 👈 IMPORTANT
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await pool.query(
      "DELETE FROM metals WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete metal" },
      { status: 500 }
    );
  }
}