import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ FIXED

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT * FROM metals WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Metal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ metal: result.rows[0] });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch metal" },
      { status: 500 }
    );
  }
}